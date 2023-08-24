<clientConfig version="1.1">
 <emailProvider id="${domain}">
   <domain>${domain}</domain>
   <displayName>${email}</displayName>
   <incomingServer type="imap">
     <hostname>imap.${domain}</hostname>
     <port>993</port>
     <socketType>SSL</socketType>
     <username>${email}</username>
     <authentication>password-cleartext</authentication>
   </incomingServer>
   <outgoingServer type="smtp">
     <hostname>smtp.${domain}</hostname>
     <port>465</port>
     <socketType>TLS</socketType>
     <username>${email}</username>
     <authentication>password-cleartext</authentication>
   </outgoingServer>
 </emailProvider>
</clientConfig>