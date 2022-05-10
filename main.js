
//Moralis.initialize("C0H532QOsNyA60mYqUvIQ76yGMTkif9dMhJZED6u"); // Application id from moralis.io
//Moralis.serverURL = "https://taw3l0v27xmn.usemoralis.com:2053/server"; //Server url from moralis.io

serverUrl = "https://taw3l0v27xmn.usemoralis.com:2053/server"
appId =  "C0H532QOsNyA60mYqUvIQ76yGMTkif9dMhJZED6u"
Moralis.start({ serverUrl, appId});
const CONTRACT_ADDRESS = "0x5ac661a869bb532272278854c5219aa231951b8e";

function fetchNFTMetadata(NFTs){
    let promises = [];
    for(let i=0; i<NFTs.length; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        //call Moralis cloud function -> static JSON file
        promises.push(fetch("https://taw3l0v27xmn.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=C0H532QOsNyA60mYqUvIQ76yGMTkif9dMhJZED6u&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(() => {return nft;}))
        /*.then(res => {
            const options = {
                address: CONTRACT_ADDRESS,
                token_id: id,
                chain: "rinkeby",
            };
            return Moralis.Web3API.token.getTokenIdOwners(options)
        })
        .then( () => { 
            nft.owners = [];
            res.result.forEach(element => {
                nft.owners.push(element.owerOf)
            });
            return nft;
        
        }))*/
    }
    return Promise.all(promises);
}

function renderInventory(NFTs){
    const parent = document.getElementById("app");
    for(let i=0; i< NFTs.length; i++){
        const nft = NFTs[i];
        let htmlString = `
        <div class="card">
        <img src="${nft.metadata.image}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${nft.metadata.name}</h5>
            <p class="card-text">${nft.metadata.description}</p>
            <p class="card-text">Total Amount: ${nft.amount}</p>
            <a href="#" class="btn btn-primary">mint</a>
        </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-3"
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }

}

async function initializeAPP() {
    try {
        currentUser = Moralis.User.current();
        if(!currentUser){//Sign in
            currentUser = await Moralis.Web3.authenticate();
        }
        const options = {
            address: CONTRACT_ADDRESS,
            chain: "rinkeby",
          };
        const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
        let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
        console.log(NFTWithMetadata);
        renderInventory(NFTWithMetadata);

    } catch (error) {
        console.log(error);
    }
}

initializeAPP();