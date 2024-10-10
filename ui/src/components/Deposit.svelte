<script lang="ts">
    import {ethers} from 'ethers';
    import {wallet} from '../stores/wallet';
    import { randomBytes } from 'crypto';
    import type {Note} from '../types/types';

    let possibleDepositValues = [0.1,1,5,10]
    let currentEthDepositAmount = possibleDepositValues[0];

    function handleRadioClick(event: Event) {
        const input = event.target as HTMLInputElement;
        currentEthDepositAmount = Number(input.value);
    }

    let note: Note | undefined = undefined;

    async function generateProtoNote(){
        const abiEncoder = new ethers.AbiCoder;
        const secret = randomBytes(32);
        const nullifierPreimage = randomBytes(32);

        //use this for Smart Contract interaction
        const commitment = ethers.keccak256(abiEncoder.encode(["bytes32","bytes32"], [nullifierPreimage, secret]))

        let protoNote: Note = {
        secret: ethers.hexlify(secret),
        nullifierPreimage: ethers.hexlify(nullifierPreimage),
        commitment,
        commitmentindex: 0,
        isL1: true
        }

        note = protoNote;
        return protoNote;
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
</script>


<h1>Current Chain: {$wallet.chainId}</h1>
<h2>Deposit</h2>
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
<p>deposit amount: {currentEthDepositAmount} eth</p>
<button class="btn btn-primary mx-auto"
    on:click={async()=>{
        await generateProtoNote();
        await downloadNote();
    }}    
>Deposit</button>