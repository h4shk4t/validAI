import React from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap, 
  Node, 
  Edge,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

const AIAgentFlowDiagram = () => {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { 
        label: 'User Input',
        description: 'Receives Solidity code and model name from the user'
      },
      position: { x: 0, y: 50 },
      sourcePosition: Position.Right,
    },
    {
      id: '2',
      data: { 
        label: 'Create Audit Package',
        description: 'Generates an audit package with the Solidity code and predefined audit prompt'
      },
      position: { x: 250, y: 50 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '3',
      data: { 
        label: 'Upload to IPFS',
        description: 'Uploads the audit package to IPFS and receives a file hash'
      },
      position: { x: 500, y: 50 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '4',
      data: { 
        label: 'Process Audit',
        description: 'Sends the IPFS hash to the AI model for analysis'
      },
      position: { x: 750, y: 50 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: '5',
      type: 'output',
      data: { 
        label: 'Return Audit Result',
        description: 'Provides the comprehensive audit report back to the user'
      },
      position: { x: 1000, y: 50 },
      targetPosition: Position.Left,
    },
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ffffff' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#00ffff' } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#ffff00' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#ff8000' } },
  ];

  const nodeStyles = {
    background: '#ffffff',
    color: '#333',
    border: '1px solid #222138',
    width: 180,
  };

  const CustomNode = ({ data }: { data: { label: string; description: string } }) => {
    return (
      <div style={{ ...nodeStyles, padding: '10px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.label}</div>
        <div style={{ fontSize: '0.8em' }}>{data.description}</div>
      </div>
    );
  };

  const nodeTypes = {
    custom: CustomNode,
  };

  const customNodes = nodes.map(node => ({
    ...node,
    type: 'custom',
  }));

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ReactFlow
        nodes={customNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default AIAgentFlowDiagram;