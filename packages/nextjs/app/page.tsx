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


function generateRandomByte32(): Uint8Array {
  return randomBytes(32);
}


const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [note, setNote] = useState("");

  async function generateTwoSecrets(){

    // let nullifierPreimage = [214,255,124,83,114,187,12,181,14,111,72,234,5,249,135,238,141,197,183,240,45,224,153,161,158,69,230,216,57,122,75,68];
    // let secret = [230,146,124,238,124,120,160,205,44,185,238,166,139,63,96,30,207,97,7,85,117,207,245,240,45,97,6,100,229,191,245,27];
    const abiEncoder = new ethers.utils.AbiCoder
    const secret = generateRandomByte32();
    const nullifierPreimage = generateRandomByte32();

    //use this for Smart Contract interaction
    const commitment = ethers.utils.keccak256(abiEncoder.encode(["bytes32","bytes32"], [nullifierPreimage, secret]))
    const nullifierHash = ethers.utils.keccak256(nullifierPreimage);
  
    setNote('{"secret": "'+ethers.utils.hexlify(secret)+'",\n'+'"nullifierPreimage": "'+ethers.utils.hexlify(nullifierPreimage)+'"\n}');
  }
  
  async function downloadNote() {
    await generateTwoSecrets()
    const element = document.createElement("a");
    const file = new Blob([note], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "note.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <button className="btn" onClick={async()=>{await downloadNote()}}>randomBuffer</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
