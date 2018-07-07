import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('Med-E Track', {
    clientId: '2oif6RxFwPChecwCmgf7rL5b7gHhUbAGnyg',
    network: 'rinkeby or ropsten or kovan',
    signer: SimpleSigner('b9f2100f022af5f039ce0d32fa4dce399e4a7682b93ec90a927d908168af9cb9')})

// Request credentials to login
uport.requestCredentials({
    requested: ['name', 'phone', 'country'],
    notifications: true // We want this if we want to recieve credentials
}).then((credentials) => {
  // Do something
})

// Attest specific credentials
uport.attestCredentials({
  sub: THE_RECEIVING_UPORT_ADDRESS,
  claim: {
    CREDENTIAL_NAME: CREDENTIAL_VALUE
  },
  exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
})
