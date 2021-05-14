import React from 'react';
import Board from './Board'

class Game extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        xIsNext: true,
        stepNumber: 0,
        hotseat: true
      }
    }
    componentDidUpdate(prevProps){
      if(!this.state.hotseat && (this.state.history.length < 10) && !this.state.xIsNext){
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let xIsNext = this.state.xisNext;
        let depth = this.state.stepNumber;

        let x = findBestMove(squares, xIsNext, depth);
        console.log(x)
      }
    }
  
    playerMove(i){
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
  
      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      
      squares[i] = this.state.xIsNext ? 'X' : 'O';
  
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length
      });
    }

    swapMode(){
      this.setState({
        history: [{
          squares: Array(9).fill(null)
        }],
        xIsNext: true,
        stepNumber: 0,
        hotseat: !this.state.hotseat
      })
    }
  
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return(
          <li key = {move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      let buttonText;
  
      if (winner){
        status = 'Winner: ' + winner;
      }
      else if(history.length < 10){
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      else{
        status = 'Game is a draw.'
      }

      buttonText = this.state.hotseat ? 'Hot Seat' : 'Versus AI';
  
      return (
        <div className="game">
            <div className="game-header">
                <h1>Tic Tac Toe</h1>
            </div>
            <div className="button-holder">
              <button className="game-button" onClick={()=>this.swapMode()}>{buttonText}</button>
            </div>
            <div className="game-board">
                <Board 
                squares={current.squares}
                onClick={(i) => this.playerMove(i)}
                />
            </div>
            <div>
                <div><h2>{ status }</h2></div>
                <div>
                  <p >
                    Move History
                  </p>
                </div>
                <ol>{moves}</ol>
            </div>
        </div>
      );
    }
    
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i ++) {
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] ===squares[b] && squares[b] === squares[c]){
        return squares[a];
      }
    }
    return null;
}

function findBestMove(squares,xIsNext, depth){
  let bestMove = -100000
  let bestSquare;
  for(let i = 0; i < squares.length; i++){
    if(!(calculateWinner(squares) || squares[i])) {
      squares[i] = xIsNext ? 'X' : 'O';
      let moveVal = miniMax(squares, !xIsNext, depth+1)
      if(moveVal > bestMove){
        bestMove=moveVal;
        bestSquare=i;
      }
    }
  }
  return bestSquare
}

function miniMax(squares, xIsNext, depth){
  if(calculateWinner(squares)){
    if(xIsNext){
      return 10+depth;
    }
    else return depth-10;
  }
  if(depth === 9){
    return 0;
  }
  else{
    if(xIsNext){
      let bestMove = -100000
      let bestSquare;
      for(let i = 0; i < squares.length; i++){
        if(!squares[i]) {
          squares[i] = xIsNext ? 'X' : 'O';
          let moveVal = miniMax(squares, !xIsNext, depth+1)
          if(moveVal > bestMove){
            bestMove=moveVal;
            bestSquare=i;
          }
        }
  }
    }
  }
}

export default Game