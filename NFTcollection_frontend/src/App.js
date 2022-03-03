import React, { useEffect, useState } from "react";
import './App.css';

import { NFTStorage, File } from "nft.storage";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import JungelTycoon from './utils/JungelTycoon.json';
import Gallery from './utils/Gallery.json';





const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [btnBusy, setBtnBusy] = useState(false);

  const [tokenIds, setTokenIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [idList, setIdList] = useState([]);

  const JungelTycoon_CONTRACT_ADDRESS = "0x0AfCed8B6f235f8B08cA8c3c48d7CFf82Aae807e";
  const Gallery_CONTRACT_ADDRESS = "0xaEE6b7C9Cc65624A7a08c6b39A7DDdE9Bc6b20dA";



  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      //get tokendIds from deployed contract jungelTycoon foreverglorydev.
      
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const connectedContract = new ethers.Contract(JungelTycoon_CONTRACT_ADDRESS, JungelTycoon.abi, signer);
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
        return;
      }
      let nftTxn = await connectedContract.walletOfOwner(account);

      let arrayVal = [];
      for(let i = 0; i < nftTxn.length; i++)
      {
        arrayVal[parseInt(nftTxn[i]._hex, 16)] = 1;
      }
      setTokenIds(arrayVal);
      console.log(arrayVal);


      // arrayVal = ['0x6f99e915Ee5B592a1Fd2203e15B0ECc157B535c8', '0x5b091d888399a8788aC76B2CE9CFd89A6Dc7EC01'];
      // nftTxn = await connectedContract.whitelistUsers(arrayVal);
      // nftTxn = await connectedContract.setOnlyWhitelisted(true);
      // console.log(nftTxn);


    } else {
      console.log("No authorized account found")
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const IPFSupload = async (data, file) => {
    try {
      const client = new NFTStorage({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4YzllNDRCRDQ5MDdBQTI4NGQ4NWRhRkJBNkMyNjI1Y2Y5ZTRhMjYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNTYwMDc5MzQxMiwibmFtZSI6ImlwZnNfa2V5In0.fgRU-eos35TM8MrCyv-wRlcxTPQEucobj2IzvzYHQ5s'
      });
      const metadata = await client.store({
        name: data.name,
        description: data.description,
        image: new File([file], file.name, { type: file.type })
      });
      console.log(metadata);
      return metadata.url;
    } catch (error) {
      console.error(error);
    } finally {
      console.log('finish');
    }
  }

  const askContractToMintNft = async () => {

    
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(JungelTycoon_CONTRACT_ADDRESS, JungelTycoon.abi, signer);
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
    console.log("connectedContract");
    console.log(signer);
    let nftTxn = await connectedContract.mint(100);
    console.log("Mining...please wait.")
    await nftTxn.wait();
    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  }
}


const askContractToStake = async () => {
  console.log("Stake button pressed");
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();


    const connectedContract = new ethers.Contract(Gallery_CONTRACT_ADDRESS, Gallery.abi, signer);
    
    
  

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return;
    }
    ////

    try {
      setBtnBusy(true);
      
            const accounts = await signer.getAddress();  
            console.log(idList);
            console.log(accounts);

            // let nftTxn = await JungelTycoonContract.setApprovalForAll(Gallery_CONTRACT_ADDRESS, true);
            // await nftTxn.wait();

            // console.log(`Approved, hehehe: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

            let nftTxn2 = await connectedContract.addToGallery(accounts, idList, 7);

            console.log("Staking...please wait.");
            await nftTxn2.wait();

            console.log(`staked, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn2.hash}`);
            
      // reset inputs
      setName("");
      setDescription("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnBusy(false);
    }
  }

}

const askContractToReward = async () => {
  console.log("Reward button pressed");
  
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(Gallery_CONTRACT_ADDRESS, Gallery.abi, signer);

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return;
    }

    try {
      setBtnBusy(true);
      
            const accounts = await signer.getAddress();  
            console.log(accounts);
            let nftTxn = await connectedContract.claimReward(accounts);

            console.log("Rewarding...please wait.");
            await nftTxn.wait();

            console.log(`rewarded, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
            
      // reset inputs
      setName("");
      setDescription("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnBusy(false);
    }
  }
}

const askContractToUnstake = async () => {
  console.log("Unstake button pressed");
  
  const { ethereum } = window;

  if (ethereum) {

    console.log(idList);


    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(Gallery_CONTRACT_ADDRESS, Gallery.abi, signer);

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return;
    }

    try {
      setBtnBusy(true);
      
            const accounts = await signer.getAddress();  
            let temp = [52, 53];
            console.log(accounts);
            let nftTxn = await connectedContract.withdrawFromGallery(temp);

            console.log("Unstaking...please wait.");
            await nftTxn.wait();

            console.log(`unstaked, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

            //after unstaking, we need to approve those new NFTs with his address.
            const connectedContract_2 = new ethers.Contract(JungelTycoon_CONTRACT_ADDRESS, JungelTycoon.abi, signer);
            
            nftTxn = await connectedContract_2.setApprovalForAll(Gallery_CONTRACT_ADDRESS, true);
            await nftTxn.wait();
            console.log(`approved, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
            
      // reset inputs
      setName("");
      setDescription("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnBusy(false);
    }
  }
}

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  const addItemToStake = () => 
  {
    let tempIdList = idList;
    tempIdList.push(selectedIds);
    setIdList(tempIdList);
    console.log(idList);
  }

  const changeSelect = (e) => 
  {
    // alert(e.target.value);
    setSelectedIds(e.target.value);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <>
            <br/><br/>  
            <br/>
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
            </>
          )}
        </div>
        <div className="body-container">
          <select onChange={changeSelect} className="add-select">
            {tokenIds.map((id, k) => (
              <option className="add-select" value={k}>NFT {k}</option>
  					))}
          </select>
          <br/><br/><br/>
          <button onClick={addItemToStake} className="add-button">
            add
          </button>
        </div>
        

        <div className="body-container">
          <button onClick={askContractToStake} className="cta-button connect-wallet-button">
            Stake
          </button>
        </div>


        <div className="body-container">
          <button onClick={askContractToReward} className="cta-button connect-wallet-button">
            Reward
          </button>
        </div>  
        <div className="footer-container">
          <button onClick={askContractToUnstake} className="cta-button connect-wallet-button">
             Unstake
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;