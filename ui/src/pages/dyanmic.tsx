import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useNavigate } from "react-router-dom";
// import { getWeb3Provider,getSigner, } from '@dynamic-labs/ethers-v6'
// import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
// const { primaryWallet } = useDynamicContext()
// const provider = await getWeb3Provider(primaryWallet)
// const signer = await getSigner(primaryWallet)

const Dynamic = () => {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/dashboard");
  }
  return <DynamicWidget />;
};

export default Dynamic;
