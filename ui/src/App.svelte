<script lang="ts">
  import {wallet} from './stores/wallet';
  import Navbar from './components/Navbar.svelte';
  import Chain from './components/Chain.svelte';
</script>

<main>
  <Navbar />
  {#if $wallet.chainId == null}
    <div class="p-10 border-2 border-white text-center">
      <h1>Connect wallet first</h1>
    </div>
  {:else}
    <Chain/>
  {/if}
</main>
