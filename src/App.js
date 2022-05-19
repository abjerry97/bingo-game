import { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { bingo } from "./data";
import DrawCanvas, { animate } from "./utils/drawCanvas";
function App() {
  const [winner, setWinner] = useState(false);
  const [bingoColumn, setbingoColumn] = useState(bingo || []);
  const [activeCard, setActiveCard] = useState(null);
  const [boardClickEvent, setboardClickEvent] = useState(false);
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
    const tempDiagonal = [];
    for (let j = 0; j < bingoColumnMap.length; j++) {
      if (j <= bingoColumnMap.length && bingoColumnMap[j][j].status !== 1) {
        return false;
      }
      tempDiagonal.push(bingoColumnMap[j][j].id);
    }

    tempDiagonal.forEach((curentTempBingo) => {
      bingoColumn[eachBingoMap[curentTempBingo]].win = true;
    });
    setbingoColumn([...bingoColumn]);

    setWinner(true);
  }

  function chkLeftDiagonal(bingoColumnMap) {
    const tempDiagonal = [];
    for (
      let j = 0, i = bingoColumnMap.length - 1;
      j < bingoColumnMap.length;
      j++, i--
    ) {
      if (j <= bingoColumnMap.length && bingoColumnMap[j][i].status !== 1) {
        return false;
      }
      tempDiagonal.push(bingoColumnMap[j][i].id);
    }

    tempDiagonal.forEach((curentTempBingo) => {
      bingoColumn[eachBingoMap[curentTempBingo]].win = true;
    });
    setbingoColumn([...bingoColumn]);

    setWinner(true);
  }

  function chkHorizontal(bingoColumnMap) {
    let tempHorizontal = [];
    for (let i = 0; i < bingoColumnMap.length; i++) {
      let temp = [];
      for (let j = 0; j < bingoColumnMap.length; j++) {
        if (bingoColumnMap[i][j].status !== 1) {
          temp = [];
          break;
        }
        temp.push(bingoColumnMap[i][j].id);
      }
      if (temp.length === 5) {
        tempHorizontal = [...tempHorizontal, ...temp];
      }

      tempHorizontal.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = true;
        setWinner(true);
      });
      setbingoColumn([...bingoColumn]);
    }
  }
  function chkVertical(bingoColumnMap) {
    let tempVertical = [];
    for (let i = 0; i < bingoColumnMap.length; i++) {
      let temp = [];
      for (let j = 0; j < bingoColumnMap.length; j++) {
        if (bingoColumnMap[j][i].status !== 1) {
          temp = [];
          break;
        }
        temp.push(bingoColumnMap[j][i].id);
      }
      if (temp.length === 5) {
        tempVertical = [...tempVertical, ...temp];
      }

      tempVertical.forEach((curentTempBingo) => {
        bingoColumn[eachBingoMap[curentTempBingo]].win = true;
        setWinner(true);
      });
      setbingoColumn([...bingoColumn]);
    }
  }
  useEffect(() => {
    if (activeCard !== null) {
      setbingoColumn(
        bingoColumn.map((curentBingo) => {
          if (String(curentBingo.id) === "12") {
            curentBingo.status = 1;
          }
          if (
            String(curentBingo.id) === String(activeCard) &&
            curentBingo.status == 1 &&
            curentBingo.win &&
            String(curentBingo.id) !== "12"
          ) {
            curentBingo.status = 0;
            curentBingo.win = false;
          } else if (
            String(curentBingo.id) === String(activeCard) &&
            curentBingo.status == 1 &&
            String(curentBingo.id) !== "12"
          ) {
            curentBingo.status = 0;
            curentBingo.win = false;
          } else if (
            String(curentBingo.id) === String(activeCard) &&
            String(curentBingo.id) !== "12"
          ) {
            curentBingo.status = 1;
          }
          return curentBingo;
        })
      );
    }

    chkDiagonal(bingoColumnMap);
    chkHorizontal(bingoColumnMap);
    chkVertical(bingoColumnMap);
    chkLeftDiagonal(bingoColumnMap);
  }, [activeCard, boardClickEvent]);

  console.log(winner)

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
                            setboardClickEvent(!boardClickEvent);
                            setActiveCard(currentColumn.id);
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
      {winner ? <DrawCanvas  winner= {winner}/> : null}
    </div>
  );
}

export default App;
