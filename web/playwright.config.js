module.exports = {
  webServer: {
    command: "npm run start-servers",
    port: 3000,
    //Playwright vil vente op til 30.000 millisekunder (eller 30 sekunder) på, at serveren (der kører i webServer)
    // starter og bliver klar til at modtage forespørgsler.
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
  // så jeg kan bruge "/" i stedet for 'http://localhost:3000' i test med playwright
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
}
