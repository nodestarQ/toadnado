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


const Deposit: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [note, setNote] = useState< Note | undefined >();
  const [secret, setSecret] = useState("");
  const [noteReady, setNoteReady] = useState(false);
  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined);
  
  const { data: L1nextIndex } = useScaffoldReadContract({
    contractName: "ToadnadoL1",
    functionName: "nextIndex",
    args: [],
  });

  const { data: commitments } = useScaffoldReadContract({
    contractName: "ToadnadoL1",
    functionName: "getAllCommitments",
    args: [],
  });

  //TOADNADO L1 CONTRACT
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("ToadnadoL1");


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
      isL1: true
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

  async function depositL1(){
    console.log("creating partial Note");
    let protonote = await generateProtoNote();
    console.log("THEN: "+ protonote.commitment);
    try {
        let nextIndex = await L1nextIndex;
        let res = await writeYourContractAsync({
          functionName: "deposit",
          args: [protonote.commitment],
          value: ethers.utils.parseEther("0.01"),
        });
        setTx(res);
        console.log(res);
        //for blockscout: console.log(res);
        protonote.isL1 = true;
        protonote.commitmentindex = nextIndex;
        setNote(protonote);
        setNoteReady(true);
      } catch (e) {
        console.error("Error setting greeting:", e);
        setNote(undefined)
      }
  }

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
            
            <button className="btn btn-secondary" onClick={async()=>{await depositL1()}}>deposit L1</button>
            {
            noteReady ? (<button className="btn btn-warning" onClick={async()=>{await downloadNote()}}>download note</button>) : (<></>)
            }
            {
            tx ? (<a href={"https://eth-sepolia.blockscout.com/tx/"+tx} target="_blank">https://eth-sepolia.blockscout.com/tx/{tx}</a>) : (<></>)
            }

            {/* <button className="btn" onClick={async()=>{await getAllCommitments()}}>commitent</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Deposit;
