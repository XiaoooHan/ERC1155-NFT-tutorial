pragma solidity ^0.8.0;

//Import ERC1155 from OpenZeppelin 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract NFTContract is ERC1155,Ownable { 
    uint public constant UCB_CS = 0;
    uint public constant SCU = 1;

    constructor() ERC1155("https://gm8cteybkik5.usemoralis.com/{id}.json"){// metadata uri id:64
        _mint(msg.sender,UCB_CS,1,"");
        _mint(msg.sender,SCU,2,"");
    }

    //Only contrat owner can mint NFT for user
    function mint(address to, uint256 id, uint256 amount) public onlyOwner{
        _mint(to, id, amount, "");
    }

    //Only burn by the token owner
    function burn(address from, uint256 id, uint256 amount) public{
        require(msg.sender == from);
        _burn(from,id,amount);
    }

}
