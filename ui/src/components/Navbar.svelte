<script lang="ts">
  import { ethers } from 'ethers';
  import {wallet} from '../stores/wallet';
  const ChainIdL1 = import.meta.env.VITE_CHAINIDL1;
  const ChainIdL2 = import.meta.env.VITE_CHAINIDL2;
    // Function to handle wallet connection logic
    const connectWallet = () => {
      wallet.connect();
    };
    const disconnectWallet = () => {
      wallet.disconnect();
    };

    const handleChainSwitch = () =>{
      if($wallet.chainId == ChainIdL1){
        wallet.switch(1)
      }else{
        wallet.switch(0)
      }
    }
    
  </script>
  
  <nav class="navbar bg-base-100">
    <div class="navbar-start">
    <div class="dropdown">
      <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><a  href="#github">Github</a></li>
      </ul>
    </div>
    <button class="btn btn-ghost text-xl">Toadnado</button>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a  href="#github">Github</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      {#if ($wallet.chainId == ChainIdL1) || ($wallet.chainId ==ChainIdL2)}
      <button class="btn btn-accent mr-2" on:click={()=>{handleChainSwitch()}}>
        <svg id='arrows-left-right_24' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>
          <g transform="matrix(1 0 0 1 12 12)" >
            <g style="" >
              <g transform="matrix(1 0 0 1 0 0)" >
                <path style="stroke: none; stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -12)" d="M 0 0 L 24 0 L 24 24 L 0 24 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 0 5)" >
                <line style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" x1="9" y1="0" x2="-9" y2="0" />
              </g>
              <g transform="matrix(1 0 0 1 -7.5 -5)" >
                <path style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-4.5, -7)" d="M 6 10 L 3 7 L 6 4" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 0 -5)" >
                <line style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" x1="-9" y1="0" x2="9" y2="0" />
              </g>
              <g transform="matrix(1 0 0 1 7.5 5)" >
                <path style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-19.5, -17)" d="M 18 20 L 21 17 L 18 14" stroke-linecap="round" />
              </g>
            </g>
          </g>
        </svg>
        {$wallet.chainId == ChainIdL1? "L1": "L2"}
      </button>
      {/if}
        {#if !$wallet.account}      
          <button class="btn btn-primary" on:click={connectWallet}>Connect Wallet</button>
        {:else}
          <button class="btn btn-primary" on:click={disconnectWallet}>{$wallet.account.slice(0, 6)}...{$wallet.account.slice(-4)}</button>
        {/if}
    </div>
  </nav>
  
  <style>
  </style>
  