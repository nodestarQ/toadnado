"use client";

import Link from "next/link";
import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { randomBytes } from 'crypto';
import { keccak256 } from 'viem';
import { ethers } from "ethers";
import {useScaffoldReadContract} from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import {useScaffoldWriteContract} from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { useSwitchChain } from 'wagmi'


function generateRandomByte32(): Uint8Array {
  return randomBytes(32);
}

type Note = {
  secret: string,
  nullifierPreimage: string,
  commitment: string,
  commitmentindex: number,
  isL1: boolean
}


const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [note, setNote] = useState< Note | undefined >();
  const [secret, setSecret] = useState("");
  const [noteReady, setNoteReady] = useState(false);
  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined);

  const { data: L2nextIndex } = useScaffoldReadContract({
    contractName: "ToadnadoL2",
    functionName: "nextIndex",
    args: [],
  });

  const { data: commitments } = useScaffoldReadContract({
    contractName: "ToadnadoL2",
    functionName: "getAllCommitments",
    args: [],
  });

  //TOADNADO L2 CONTRACT
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("ToadnadoL2");

  async function getAllCommitments(){
    let layer1Commitments: string[] = [];
    let layer2Commitments: string[] = [];
    let l1Array = await commitments[0];
    let l2Array = await commitments[1];

    for (let i = 0; i < l1Array.length; i++) {
      if(l1Array[i] == "0x0000000000000000000000000000000000000000000000000000000000000000"){break}
      layer1Commitments.push(ethers.utils.hexlify(l1Array[i]))
    }
    for (let i = 0; i < l2Array.length; i++) {
      if(l1Array[i] == "0x0000000000000000000000000000000000000000000000000000000000000000"){break}
      layer2Commitments.push(ethers.utils.hexlify(l2Array[i]))
    }

    console.log(layer1Commitments);
    console.log(layer2Commitments);
  }

  async function generateProtoNote(){
    const abiEncoder = new ethers.utils.AbiCoder
    const secret = generateRandomByte32();
    const nullifierPreimage = generateRandomByte32();

    //use this for Smart Contract interaction
    const commitment = ethers.utils.keccak256(abiEncoder.encode(["bytes32","bytes32"], [nullifierPreimage, secret]))
    // const nullifierHash = ethers.utils.keccak256(nullifierPreimage);

    let protoNote: Note = {
      secret: ethers.utils.hexlify(secret),
      nullifierPreimage: ethers.utils.hexlify(nullifierPreimage),
      commitment,
      commitmentindex: 0,
      isL1: false
    }

    setNote(protoNote);
    return protoNote;
    //setNote('{"secret": "'+ethers.utils.hexlify(secret)+'",\n'+'"nullifierPreimage": "'+ethers.utils.hexlify(nullifierPreimage)+'"\n}');
  }

  async function downloadNote() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(note, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "note.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  }

  async function depositL2(){
    console.log("creating partial Note");
    let protonote = await generateProtoNote();
    console.log("THEN: "+ protonote.commitment);
    try {
      let nextIndex = await L2nextIndex;
      let res = await writeYourContractAsync({
        functionName: "deposit",
        args: [protonote.commitment],
        value: ethers.utils.parseEther("0.01"),
      });
      setTx(res);
      console.log(res);
      //for blockscout: console.log(res);
      protonote.isL1 = false;
      protonote.commitmentindex = nextIndex;
      setNote(protonote);
      setNoteReady(true);
    } catch (e) {
      console.error("Error setting greeting:", e);
      setNote(undefined)
    }
  }
  const { switchChainAsync } = useSwitchChain();
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Toadnado</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center">Deposit 0.01ETH</p>
          <div className="grid grid-cols gap-4 items-center ">

            <button className="btn btn-secondary" onClick={async () => {
              //cursed way to do it i know
              if (await ethereum.request({ method: "eth_chainId" }) !== "0x21fe10") {
                await switchChainAsync({ chainId: 2227728 })
                location.reload();0xaa36a7
              }
              await depositL2()
            }}>deposit L2</button>
            {
              noteReady ? (<button className="btn btn-warning" onClick={async()=>{await downloadNote()}}>download note</button>) : (<></>)
            }
            {
              tx ? (<a href={"https://l1sload-blockscout.scroll.io/tx/"+tx} target="_blank">https://l1sload-blockscout.scroll.io/tx/{tx}</a>) : (<></>)
            }

            {/* <button className="btn" onClick={async()=>{await getAllCommitments()}}>commitent</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
