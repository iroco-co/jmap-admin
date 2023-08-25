<script lang="ts">
  import { _ } from 'svelte-i18n'
  import type PageData from '@sveltejs/kit'
  export let data: PageData
</script>

<section class="account__dns">
  <h1>{$_('account.dns.title')}</h1>
  <pre>
    @                       IN MX     2 smtp
    @                   600 IN TXT    "v=spf1 mx a:smtp.{data.name} ~all"
    smtp                    IN MX     5 smtp
    imap                    IN MX     10 imap
    imap                    IN A      178.237.111.140
    smtp                    IN A      178.237.111.140
    autodiscover            IN A      178.237.111.140
    _dmarc                  IN TXT    ( "v=DMARC1;p=quarantine;pct=100;sp=reject;aspf=r;" )
    dkim._domainkey         IN TXT    ( "h=sha256;k=rsa;p={data.dkim_public_key};t=s; )
  </pre>
</section>