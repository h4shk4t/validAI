import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContractAnalysisProps {
  code: string;
  onClose: () => void;
}

const ContractAnalysis: React.FC<ContractAnalysisProps> = ({ code, onClose }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const prevCodeRef = useRef<string>("");

  useEffect(() => {
    if (code !== prevCodeRef.current) {
      analyzeContract();
      prevCodeRef.current = code;
    }
  }, [code]);

  const analyzeContract = async () => {
    setLoading(true);
    
    try {
      const encodedCode = encodeURIComponent(code);
      const url = `https://wapo-testnet.phala.network/ipfs/QmVX6X7gVpUrKfy1xkEmmorcAy8mjfLh79N48vjfMHsc9x?sol=${encodedCode}&model=gpt-4`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setAnalysis(data.message);
    } catch (error) {
      console.error('Error analyzing contract:', error);
      setAnalysis('Error analyzing contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full overflow-auto relative">
      <Button
        onClick={onClose}
        className="absolute top-2 right-2 p-2"
        variant="ghost"
        size="icon"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      <CardHeader>
        <CardTitle>Contract Audit</CardTitle>
        <CardDescription>Security analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2">Analyzing contract...</p>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractAnalysis;