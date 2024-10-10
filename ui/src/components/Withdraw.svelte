<script lang="ts">
    import { ethers } from 'ethers';
    import {wallet} from '../stores/wallet';
    import type {Note} from '../types/types';
    import  {isNote} from '../types/types';

    let possibleDepositValues = [0.1,1,5,10]
    let currentEthDepositAmount = possibleDepositValues[0];
    
    function handleRadioClick(event: Event) {
      const input = event.target as HTMLInputElement;
      currentEthDepositAmount = Number(input.value);
    }

    let inputNote = "";
    let isNoteValid = false;
    let recipient = ""; 
    let isRecipientValid = false;

    function validateAddress(event: Event) {
      const input = (event.target as HTMLInputElement).value;
      isRecipientValid = ethers.isAddress(input);
    }
    
    function validateNote(event: Event) {
      const input = (event.target as HTMLInputElement).value;
      try {
        let possibleNote = JSON.parse(input)
        isNoteValid = isNote(possibleNote);
        
      } catch (error) {
        isNoteValid = false;
      }
    }

</script>


<h1>Current Chain: {$wallet.chainId}</h1>
      <h2>Withdraw</h2>
      <ul class="timeline w-full justify-center">
        {#each possibleDepositValues as ethValue, index }  
            <li>
                {#if index != 0}
                    <hr class="bg-primary" />
                {/if}
                <div class="timeline-end timeline-box">{ethValue}</div>
                <div class="timeline-middle">
                <input type="radio" name="radio-2" class="radio radio-primary" value={ethValue} on:click={handleRadioClick} checked={index==0}/>
                </div>
                {#if index != possibleDepositValues.length-1}
                    <hr class="bg-primary" />
                {/if}
            </li>
        {/each}
      </ul>
      <p>Withdraw amount: {currentEthDepositAmount} eth</p>
      <div class="grid gap-2">
        <label class={`input input-bordered flex items-center gap-2 ${inputNote&&!isNoteValid ? 'input-error' : ''}`}>
          Note:
          <input type="text" class="grow" placeholder="" on:input={validateNote} bind:value={inputNote}/>
        </label>
        <label class={`input input-bordered flex items-center gap-2 ${recipient&&!isRecipientValid ? 'input-error' : ''}`}>
          Recipient:
          <input type="text" class="grow" placeholder="" on:input={validateAddress} bind:value={recipient}/>
        </label>
        <button class="btn mx-auto btn-primary"
        disabled={!(isNoteValid && isRecipientValid && inputNote && recipient)}
        >Withdraw</button>
      </div>