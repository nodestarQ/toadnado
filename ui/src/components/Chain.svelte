<script lang="ts">
  import Deposit from './Deposit.svelte';
  import Withdraw from './Withdraw.svelte';
  import {wallet} from '../stores/wallet';
  const ChainIdL1 = import.meta.env.VITE_CHAINIDL1;
  const ChainIdL2 = import.meta.env.VITE_CHAINIDL2;
  let isDeposit = true;

</script>

{#if $wallet.chainId == ChainIdL1 || $wallet.chainId == ChainIdL2 }
  <div class="w-full flex justify-between">
    <button class={`p-2 border-x-2 border-t-2 border-primary font-bold ${isDeposit ? 'bg-primary text-black' : 'text-primary'}`} on:click={()=>{isDeposit=true}}>
      Deposit
    </button>
    <button class={`p-2 border-x-2 border-t-2 border-primary font-bold ${!isDeposit ? 'bg-primary text-black' : 'text-primary'}`} on:click={()=>{isDeposit=false}}>
      Withdraw
    </button>
  </div>
  <div class="p-10 border-2 border-primary text-center h-1/2">
    {#if isDeposit}
    <Deposit/>
    {:else}
    <Withdraw/>
    {/if}
  </div>

{:else}
  <div class="p-10 border-2 border-white 2-full text-center">
    <button class="btn mx-auto btn-accent" on:click={async ()=>{await wallet.switch(0)}}>
      Switch Network
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
    </button>
  </div>
  
{/if}