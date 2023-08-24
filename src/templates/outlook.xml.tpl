<?xml version="1.0" encoding="utf-8" ?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
   <Response xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a">
       <Account>
           <AccountType>email</AccountType>
           <Action>settings</Action>
           <Protocol>
               <Type>IMAP</Type>
               <Server>imap.${domain}</Server>
               <Port>993</Port>
               <DomainRequired>on</DomainRequired>
               <LoginName>${email}</LoginName>
               <SPA>off</SPA>
               <SSL>on</SSL>
               <AuthRequired>on</AuthRequired>
           </Protocol>
           <Protocol>
               <Type>SMTP</Type>
               <Server>smtp.${domain}</Server>
               <Port>465</Port>
               <DomainRequired>on</DomainRequired>
               <LoginName>${email}</LoginName>
               <SPA>off</SPA>
               <Encryption>TLS</Encryption>
               <SSL>on</SSL>
               <AuthRequired>on</AuthRequired>
               <UsePOPAuth>off</UsePOPAuth>
               <SMTPLast>off</SMTPLast>
           </Protocol>
       </Account>
   </Response>
</Autodiscover>