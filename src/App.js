import { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { bingo } from "./data";
import DrawCanvas, { animate } from "./utils/drawCanvas";
function App() {
  const [winner, setWinner] = useState(false);
  const [bingoColumn, setbingoColumn] = useState(bingo || []);
  const [activeCard, setActiveCard] = useState(null);
  const [activeCardPosition, setActiveCardPosition] = useState({});
  const [winArray, setwinArray] = useState([]);
  const [boardClickEventType, setboardClickEventType] = useState(0);
  const chunkSize = 5;
  const eachBingoMap = {};
  bingoColumn.forEach(({ id }, index) => {
    eachBingoMap[id] = index;
  });
  let bingoColumnMap = [];

  for (let i = 0; i < bingoColumn.length; i += chunkSize) {
    const chunk = bingoColumn.slice(i, i + chunkSize);
    bingoColumnMap.push(chunk);
  }

  function chkDiagonal(bingoColumnMap) {
    let tempDiagonal = [];
    let isWin = true;
    for (let j = 0; j < bingoColumnMap.length; j++) {
      if (j <= bingoColumnMap.length && bingoColumnMap[j][j].status !== 1) {
        isWin = false;
        break;
      }
      tempDiagonal.push(bingoColumnMap[j][j].id);
    }
    if (isWin) {
      tempDiagonal.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = true;
        bingoColumn[eachBingoMap[curentTempBingo]].diagonalWin = true;
      });

      if (tempDiagonal.length === 5) {
        const containsAll = tempDiagonal.every((element) => {
          return winArray.includes(element);
        });
        if (!containsAll) {
          setwinArray([...winArray, ...tempDiagonal]);

          setWinner(true);
        }
      }

      setbingoColumn([...bingoColumn]);
    }
  }

  function unChkDiagonal(bingoColumnMap) {
    let tempDiagonal = [];
    let isWin = true;
    for (let j = 0; j < bingoColumnMap.length; j++) {
      if (bingoColumnMap[j][j].status !== 1) {
        isWin = false;
      }
      if (
        !bingoColumnMap[j][j].verticalWin &&
        !bingoColumnMap[j][j].horizontalWin &&
        !bingoColumnMap[j][j].leftDiagonalWin
      ) {
        tempDiagonal.push(bingoColumnMap[j][j].id);
      }
    }
    if (!isWin) {
      tempDiagonal.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = false;
        bingoColumn[eachBingoMap[curentTempBingo]].diagonalWin = false;
      });

      const updateWinArray = tempDiagonal.every((element) => {
        return winArray.filter((current) => current !== element);
      });
      if (Array.isArray(updateWinArray)) {
        setwinArray(updateWinArray);
      }

      setbingoColumn([...bingoColumn]);
    }
  }

  function chkLeftDiagonal(bingoColumnMap) {
    let tempDiagonal = [];
    let isWin = true;
    for (
      let j = 0, i = bingoColumnMap.length - 1;
      j < bingoColumnMap.length;
      j++, i--
    ) {
      if (j <= bingoColumnMap.length && bingoColumnMap[j][i].status !== 1) {
        isWin = false;
        break;
      }
      tempDiagonal.push(bingoColumnMap[j][i].id);
    }
    if (isWin) {
      tempDiagonal.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = true;
        bingoColumn[eachBingoMap[curentTempBingo]].leftDiagonalWin = true;
      });

      if (tempDiagonal.length === 5) {
        const containsAll = tempDiagonal.every((element) => {
          return winArray.includes(element);
        });
        if (!containsAll) {
          setwinArray([...winArray, ...tempDiagonal]);

          setWinner(true);
        }
      }
    }
    setbingoColumn([...bingoColumn]);
  }

  function unChkLeftDiagonal(bingoColumnMap) {
    let tempDiagonal = [];
    let isWin = true;
    for (
      let j = 0, i = bingoColumnMap.length - 1;
      j < bingoColumnMap.length;
      j++, i--
    ) {
      if (bingoColumnMap[j][i].status !== 1) {
        isWin = false;
      }
      if (
        !bingoColumnMap[j][i].verticalWin &&
        !bingoColumnMap[j][i].horizontalWin &&
        !bingoColumnMap[j][i].diagonalWin
      ) {
        tempDiagonal.push(bingoColumnMap[j][i].id);
      }
    }

    if (!isWin) {
      tempDiagonal.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = false;
        bingoColumn[eachBingoMap[curentTempBingo]].leftDiagonalWin = false;
      });

      const updateWinArray = tempDiagonal.every((element) => {
        return winArray.filter((current) => current !== element);
      });
      if (Array.isArray(updateWinArray)) {
        setwinArray(updateWinArray);
      }

      setbingoColumn([...bingoColumn]);
    }
  }

  function chkHorizontal(bingoColumnMap) {
    for (let i = 0; i < bingoColumnMap.length; i++) {
      let isWin = true;
      let temp = [];
      for (let j = 0; j < bingoColumnMap.length; j++) {
        if (bingoColumnMap[i][j].status !== 1) {
          isWin = false;
          break;
        }
        temp.push(bingoColumnMap[i][j].id);
      }

      if (isWin) {
        temp.forEach((curentTempBingo) => {
          bingoColumn[eachBingoMap[curentTempBingo]].win = true;
          bingoColumn[eachBingoMap[curentTempBingo]].horizontalWin = true;
        });

        if (temp.length === 5) {
          const containsAll = temp.every((element) => {
            return winArray.includes(element);
          });
          if (!containsAll) {
            setwinArray([...winArray, ...temp]);

            setWinner(true);
          }
        }
      }
    }

    setbingoColumn([...bingoColumn]);
  }


  function unChkHorizontal(bingoColumnMap,rowToUncheck) {
   
      let isWin = true;
      let temp = [];
      for (let j = 0; j < bingoColumnMap[rowToUncheck].length; j++) {
        if (bingoColumnMap[rowToUncheck][j].status !== 1) {
          isWin = false;
        }
        if (
          !bingoColumnMap[rowToUncheck][j].verticalWin &&
          !bingoColumnMap[rowToUncheck][j].diagonalWin &&
          !bingoColumnMap[rowToUncheck][j].leftDiagonalWin
        ) {
          temp.push(bingoColumnMap[rowToUncheck][j].id);
        }
      }

      if (!isWin) {
        temp.forEach((curentTempBingo) => {
          bingoColumn[eachBingoMap[curentTempBingo]].win = false;
          bingoColumn[eachBingoMap[curentTempBingo]].horizontalWin = false;
        });
  
        const updateWinArray = temp.every((element) => {
          return winArray.filter((current) => current !== element);
        });
        if (Array.isArray(updateWinArray)) {
          setwinArray(updateWinArray);
        }
  
        setbingoColumn([...bingoColumn]);
      }
  }


  function chkVertical(bingoColumnMap) {
    for (let i = 0; i < bingoColumnMap.length; i++) {
      let isWin = true;
      let temp = [];
      for (let j = 0; j < bingoColumnMap.length; j++) {
        if (bingoColumnMap[j][i].status !== 1) {
          isWin = false;
          break;
        }
        temp.push(bingoColumnMap[j][i].id);
      }

      if (isWin) {
        temp.forEach((curentTempBingo) => {
          bingoColumn[eachBingoMap[curentTempBingo]].win = true;
          bingoColumn[eachBingoMap[curentTempBingo]].verticalWin = true;
        });

        if (temp.length === 5) {
          const containsAll = temp.every((element) => {
            return winArray.includes(element);
          });
          if (!containsAll) {
            setwinArray([...winArray, ...temp]);

            setWinner(true);
          }
        }
      }
    }

    setbingoColumn([...bingoColumn]);
  }


  function unChkVertical(bingoColumnMap,columnToUncheck) {
   
    let isWin = true;
    let temp = [];
    for (let j = 0; j < bingoColumnMap.length; j++) {
      if (bingoColumnMap[j][columnToUncheck].status !== 1) {
        isWin = false;
      }
      if (
        !bingoColumnMap[j][columnToUncheck].horizontalWin &&
        !bingoColumnMap[j][columnToUncheck].diagonalWin &&
        !bingoColumnMap[j][columnToUncheck].leftDiagonalWin
      ) {
        temp.push(bingoColumnMap[j][columnToUncheck].id);
      }
    }

    if (!isWin) {
      temp.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = false;
        bingoColumn[eachBingoMap[curentTempBingo]].verticalWin = false;
      });

      const updateWinArray = temp.every((element) => {
        return winArray.filter((current) => current !== element);
      });
      if (Array.isArray(updateWinArray)) {
        setwinArray(updateWinArray);
      }

      setbingoColumn([...bingoColumn]);
    }
}
  useEffect(() => {
    const { i = 0, j = 0 } = activeCardPosition;
    if (Number(boardClickEventType) > 0) {
      setbingoColumn(
        bingoColumn.map((currentBingo) => {
          if (String(currentBingo.id) === "12") {
            currentBingo.status = 1;
          }
          if (
            String(currentBingo.id) === String(activeCard) &&
            String(currentBingo.id) !== "12"
          ) {
            currentBingo.status = 1;
          }
          return currentBingo;
        })
      );

      if (i + j === 4) {
        chkLeftDiagonal(bingoColumnMap);
      } else if (i === j) {
        chkDiagonal(bingoColumnMap);
      }

      chkHorizontal(bingoColumnMap);
      chkVertical(bingoColumnMap);
    } else if (Number(boardClickEventType < 0)) {
      setbingoColumn(
        bingoColumn.map((currentBingo) => {
          if (String(currentBingo.id) === "12") {
            currentBingo.status = 1;
          }
          if (
            String(currentBingo.id) === String(activeCard) &&
            currentBingo.status == 1 &&
            String(currentBingo.id) !== "12"
          ) {
            currentBingo.status = 0;
            currentBingo.win = false;
          }
          return currentBingo;
        })
      );
      if (i + j === 4) {
        unChkLeftDiagonal(bingoColumnMap);
      } else if (i === j) {
        unChkDiagonal(bingoColumnMap);
      }
      unChkHorizontal(bingoColumnMap,i)
      
      unChkVertical(bingoColumnMap,j)

       }
  }, [activeCard, boardClickEventType]);
  return (
    <div className="bgdds vh-100 d-flex justify-content-center">
      <div className="shadow-sm overflow-hidden rounded-lg text-white yellow-border board-wrapper m-auto mt-5">
        <div className=" bg-red text-center">
          <h3 className="m-0 p-3">Online Conferencing</h3>
        </div>

        <div className=" bg-wne p-0 p-md-3 ">
          {!!bingoColumnMap &&
            bingoColumnMap.map((currentRow, index) => {
              return (
                <div key={index} className="table-wrapper">
                  {!!currentRow &&
                    currentRow.map((currentColumn, columnIndex) => {
                      return (
                        <div
                          key={columnIndex}
                          id={`card-${currentColumn.id}`}
                          onClick={() => {
                            setboardClickEventType(
                              Number(currentColumn.status) == 1 ? -1 : 1
                            );
                            setActiveCard(currentColumn.id);
                            activeCardPosition.i = index;
                            activeCardPosition.j = columnIndex;

                            setActiveCardPosition(activeCardPosition);
                          }}
                          className={`p-0 mb-2 ${
                            !!bingoColumn[eachBingoMap[currentColumn.id]]
                              .status &&
                            bingoColumn[eachBingoMap[currentColumn.id]]
                              .status === 1
                              ? "active-card"
                              : ""
                          }  ${
                            !!bingoColumn[eachBingoMap[currentColumn.id]]
                              .win === true
                              ? "win-card"
                              : ""
                          }`}
                        >
                          <div className=" m-1 mark bg-red p-1  lh-sm shadow-sm rounded overflow-hidden">
                            <div className="inner-border h-100 p-0 px-md-1 py-md-1 fw-bold">
                              <div className=" text-end">
                                {" "}
                                {currentColumn.id}
                              </div>
                              <div className=" overflow-hidden">
                                {currentColumn.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
      </div>
      {winner ? <DrawCanvas winner={winner} setWinner={setWinner} /> : null}
    </div>
  );
}

export default App;
