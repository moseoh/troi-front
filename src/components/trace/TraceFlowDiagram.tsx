'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AdTrace } from '@/types';

interface TraceFlowDiagramProps {
  traces: AdTrace[];
}

interface FlowNode {
  url: string;
  type: 'source' | 'landing' | 'internal' | 'conversion' | 'exit';
  count: number;
}

interface FlowEdge {
  source: string;
  target: string;
  count: number;
  converted: boolean;
}

export function TraceFlowDiagram({ traces }: TraceFlowDiagramProps) {
  // referrerFlows 데이터를 노드와 엣지로 변환
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodeMap = new Map<string, FlowNode>();
    const edgeMap = new Map<string, FlowEdge>();

    traces.forEach((trace) => {
      if (!trace.referrerFlows || trace.referrerFlows.length === 0) return;

      trace.referrerFlows.forEach((flow, index) => {
        // 소스 노드
        if (!nodeMap.has(flow.sourceUrl)) {
          nodeMap.set(flow.sourceUrl, {
            url: flow.sourceUrl,
            type: flow.flowType === 'external' ? 'source' : index === 0 ? 'landing' : 'internal',
            count: 0,
          });
        }
        const sourceNode = nodeMap.get(flow.sourceUrl)!;
        sourceNode.count += 1;

        // 목적지 노드
        const isLastFlow = index === trace.referrerFlows!.length - 1;
        const targetType = isLastFlow
          ? trace.conversion.converted
            ? 'conversion'
            : 'exit'
          : flow.destinationUrl.includes('/checkout') || flow.destinationUrl.includes('/cart')
          ? 'internal'
          : 'internal';

        if (!nodeMap.has(flow.destinationUrl)) {
          nodeMap.set(flow.destinationUrl, {
            url: flow.destinationUrl,
            type: targetType,
            count: 0,
          });
        }
        const targetNode = nodeMap.get(flow.destinationUrl)!;
        targetNode.count += 1;

        // 엣지
        const edgeKey = `${flow.sourceUrl}->${flow.destinationUrl}`;
        if (!edgeMap.has(edgeKey)) {
          edgeMap.set(edgeKey, {
            source: flow.sourceUrl,
            target: flow.destinationUrl,
            count: 0,
            converted: trace.conversion.converted,
          });
        }
        const edge = edgeMap.get(edgeKey)!;
        edge.count += 1;
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values()),
    };
  }, [traces]);

  // React Flow 노드 생성
  const nodes: Node[] = useMemo(() => {
    // URL을 계층별로 그룹화
    const layers = new Map<number, FlowNode[]>();

    flowNodes.forEach((node) => {
      let layer = 0;
      if (node.type === 'source') layer = 0;
      else if (node.type === 'landing') layer = 1;
      else if (node.type === 'internal') layer = 2;
      else if (node.type === 'conversion' || node.type === 'exit') layer = 3;

      if (!layers.has(layer)) {
        layers.set(layer, []);
      }
      layers.get(layer)!.push(node);
    });

    // 각 계층의 노드를 세로로 배치
    const result: Node[] = [];
    let globalIndex = 0;

    Array.from(layers.keys())
      .sort((a, b) => a - b)
      .forEach((layer) => {
        const nodesInLayer = layers.get(layer)!;
        const layerHeight = nodesInLayer.length * 100;
        const startY = -layerHeight / 2;

        nodesInLayer.forEach((node, index) => {
          const yPos = startY + index * 100;
          const xPos = layer * 300;

          // URL에서 도메인 제거하여 라벨 생성
          let label = node.url;
          try {
            const urlObj = new URL(node.url);
            label = urlObj.pathname || urlObj.hostname;
          } catch {
            label = node.url;
          }

          // 노드 색상
          let backgroundColor = '#f3f4f6';
          let borderColor = '#9ca3af';
          let textColor = '#374151';

          if (node.type === 'source') {
            backgroundColor = '#dbeafe';
            borderColor = '#3b82f6';
            textColor = '#1e40af';
          } else if (node.type === 'conversion') {
            backgroundColor = '#d1fae5';
            borderColor = '#10b981';
            textColor = '#065f46';
          } else if (node.type === 'exit') {
            backgroundColor = '#fee2e2';
            borderColor = '#ef4444';
            textColor = '#991b1b';
          }

          result.push({
            id: node.url,
            type: 'default',
            position: { x: xPos, y: yPos },
            data: {
              label: (
                <div className="text-xs">
                  <div className="font-medium" style={{ color: textColor }}>
                    {label.length > 30 ? label.substring(0, 30) + '...' : label}
                  </div>
                  <div className="text-gray-600 mt-1">{node.count}명</div>
                </div>
              ),
            },
            style: {
              background: backgroundColor,
              border: `2px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '10px',
              width: 200,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          });

          globalIndex++;
        });
      });

    return result;
  }, [flowNodes]);

  // React Flow 엣지 생성
  const edges: Edge[] = useMemo(() => {
    return flowEdges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: edge.converted,
      style: {
        strokeWidth: Math.max(2, Math.min(edge.count * 2, 10)),
        stroke: edge.converted ? '#10b981' : '#9ca3af',
      },
      label: `${edge.count}명`,
      labelStyle: {
        fill: '#374151',
        fontSize: 10,
        fontWeight: 500,
      },
      labelBgStyle: {
        fill: '#ffffff',
        fillOpacity: 0.8,
      },
    }));
  }, [flowEdges]);

  const [nodesState, , onNodesChange] = useNodesState(nodes);
  const [edgesState, , onEdgesChange] = useEdgesState(edges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
  }, []);

  if (traces.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border bg-gray-50">
        <p className="text-gray-500">표시할 흐름 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg border bg-white">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const type = flowNodes.find((n) => n.url === node.id)?.type;
            if (type === 'source') return '#3b82f6';
            if (type === 'conversion') return '#10b981';
            if (type === 'exit') return '#ef4444';
            return '#9ca3af';
          }}
        />
      </ReactFlow>
    </div>
  );
}
