import "@phala/wapo-env";
import { Hono } from "hono/tiny";
import { html, raw } from "hono/html";
import { handle } from "@phala/wapo-env/guest";

export const app = new Hono();
const auditPrompt = `
You are a smart contract auditor. Your task is to analyze the provided Solidity code and create a comprehensive audit report. Please include the following in your report:

1. A full analysis of the contract, identifying any potential vulnerabilities or security issues.
2. A markdown-formatted report detailing your findings, including:
   - An overview of the contract's purpose and functionality
   - A list of identified vulnerabilities, if any, with explanations and suggested fixes
   - Best practices that are followed or missing in the code
   - Gas optimization suggestions, if applicable
3. Assign scores (out of 10) for the following factors:
   - Security: How secure is the contract against known vulnerabilities?
   - Code Quality: How well-written and maintainable is the code?
   - Gas Efficiency: How optimized is the contract for gas usage?
   - Overall Score: An average of the above scores

Your report should be thorough and professional, similar to a lighthouse report for frontend websites. Please provide actionable insights and recommendations for improving the smart contract.

Analyze the following Solidity code and provide your audit report:

{solidity_code}
`;

async function uploadToIPFS(content: string): Promise<string | null> {
  try {
    const response = await fetch("http://10.51.5.222:8000/upload-to-ipfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    const data = (await response.json()) as { hash: string };
    console.info(data)
    return data.hash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return null;
  }
}

async function processAudit(fileId: string, modelName: string): Promise<any> {
  try {
    const response = await fetch("https://1ad7-223-255-254-102.ngrok-free.app/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        file_id: fileId,
        model_name: modelName,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error processing audit:", error);
    return null;
  }
}

function createAuditPackage(solidityCode: string): string {
  return JSON.stringify({
    prompt: auditPrompt.replace("{solidity_code}", solidityCode),
    context:
      "This is a smart contract audit request. The provided Solidity code should be analyzed for security vulnerabilities, code quality, and gas efficiency.",
    solidityCode: solidityCode,
  });
}

app.get("/", async (c) => {
  let queries = c.req.queries() || {};
  const solidityCode = queries.solidityCode
    ? queries.solidityCode[0]
    : "pragma solidity ^0.8.0;\n\ncontract Example {}";
  const modelName = queries.model ? queries.model[0] : "llama3-8b-8192";

  let result: {
    solidityCode: string;
    ipfsHash: string | null;
    auditResult: any | null;
  } = {
    solidityCode,
    ipfsHash: null,
    auditResult: null,
  };

  const auditPackage = createAuditPackage(solidityCode);
  result.ipfsHash = await uploadToIPFS(auditPackage) ?? "";

    result.auditResult = await processAudit(result.ipfsHash, modelName);

  return c.json(result);
});

app.post("/", async (c) => {
  try {
    const data = await c.req.json();
    console.log("user payload in JSON:", data);

    const solidityCode =
      data.solidityCode || "pragma solidity ^0.8.0;\n\ncontract Example {}";
    const modelName = data.model || "llama3-8b-8192";

    let result: {
      solidityCode: string;
      ipfsHash: string | null;
      auditResult: any | null;
    } = {
      solidityCode,
      ipfsHash: null,
      auditResult: null,
    };

    const auditPackage = createAuditPackage(solidityCode);
    result.ipfsHash = await uploadToIPFS(auditPackage);

    result.auditResult = await processAudit(result.ipfsHash ?? "", modelName);
    return c.json(result);
  } catch (error) {
    console.error("Error in POST route:", error);
    return c.json(
      { error: "An error occurred while processing the request" },
      500
    );
  }
});

export default handle(app);
