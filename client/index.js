const Web3 = require("web3");
const Coin = require('./contracts/MyToken.json');

const init = async () => {
    // const web3 = new Web3 ('http://127.0.0.1:9545/');
    const web3 = new Web3('https://goerli.infura.io/v3/e67ebddca40b4a1ca63d4067801f00c4');
    const contract = await new web3.eth.Contract(Coin.abi, "0x615e3E32231B0FaCd99B3656279AEd232512a044")
    console.log(contract);
    // const name = await contract.methods.name().call();
    // console.log(name);

    // const balanceOfFirstAccountBefore = await contract.methods.balanceOf('0x3de86576e527445fab9533a82668809a81a1a20c').call();
    // const balanceOfSecondAccountBefore = await contract.methods.balanceOf('0x465e99f4f5cd314201ed7c4624b7c974a7900bdd').call();

    // await contract.methods.transfer('0x465e99f4f5cd314201ed7c4624b7c974a7900bdd', 10000)
    // .send({from: '0x3de86576e527445fab9533a82668809a81a1a20c'});
    // const balanceOfFirstAccountAfter = await contract.methods.balanceOf('0x3de86576e527445fab9533a82668809a81a1a20c').call();
    // const balanceOfSecondAccountAfter = await contract.methods.balanceOf('0x465e99f4f5cd314201ed7c4624b7c974a7900bdd').call();
    // console.log("init balance of first account: ", balanceOfFirstAccountBefore);
    // console.log("init balance of second account: ", balanceOfSecondAccountBefore);
    // console.log("after transfer, balance of first account: ", balanceOfFirstAccountAfter);
    // console.log("after transfer, balance of second account: ", balanceOfSecondAccountAfter);
}
init();