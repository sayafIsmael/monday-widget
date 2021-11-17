import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
// import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import 'antd/dist/antd.css';
// import { Card } from 'antd';
import { Typography } from 'antd';
// import { FilterOutlined } from '@ant-design/icons'
import moment from "moment"

const { Title } = Typography;

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      context: {},
      settings: {},
      name: "",
      boardData: {},
      filteredStatusCount: 0,
      allItemsCount: 0,
      liveschangesCount: 0
    };
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });
    // TODO: set up event listeners
    monday.listen("context", res => {
      this.setState({ context: res.data });
      console.log(res.data);
      monday.api(`{
        boards(ids: 1676895469) {
          items{
            name
          }
        }
      }`,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          console.log("Res  all:", res.data.boards[0].items.length)
          this.setState({ allItemsCount: res.data.boards[0].items.length })
        });
      monday.api(`{
        items_by_multiple_column_values(board_id: 1676895469, column_id: "status_8", column_values: ["Lives Changes"]) {
          name
          column_values {
            id
            text
          }
        }
      }
      `,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          const allData = []
          const tcr = []

          res.data.items_by_multiple_column_values.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                allData[i].map(field2 => {
                  if (field2.id == "status_4" && (field2.text == "Smile Style Cancelled") || (field2.text == "Surgery Cancelled")) {
                    console.log("field2.text: ", field2.text)
                    tcr.push(0.5)
                  }
                  if (field2.id == "status_4" && field2.text == "" || field2.text == null) {
                    allData[i].map(field3 => {
                      if (field3.id == "numbers_14" && Number(field3.text) > 1000) {
                        console.log("field3.text > 1000: ", field3.text)
                        tcr.push(1.5)
                      }
                      if (field3.id == "numbers_14") {
                        console.log("field3.text: ", field3.text)

                        tcr.push(1)
                      }
                    })
                  }
                })
              }

            })
          })

          const liveschangesCount = tcr.reduce((a, b) => Number(a) + Number(b), 0)

          console.log("TCR: ", tcr)

          this.setState({
            liveschangesCount,
          })

          console.log({
            liveschangesCount,
          })
        });
    })


  }

  render() {
    return <div className="App" style={{ background: (this.state.settings.background) }}>
      {/* <Card title="Percentage Attempting Finance" extra={<FilterOutlined />} style={{ width: 400, marginLeft: 20 }}>
        <Title level={2}
          style={{ textAlign: 'center' }}
        >{(parseFloat((this.state.filteredStatusCount / this.state.allItemsCount) * 100) || 0).toFixed(2)}%</Title>
      </Card> */}
      <div
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <h2>Percentage Attempting Finance</h2> */}
        <h2 style={{ fontSize: 75 }}>{(parseFloat((this.state.liveschangesCount / this.state.allItemsCount) * 100) || 0).toFixed(1)}%</h2>
      </div>

    </div>;
  }
}

export default App;
