import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
// import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import 'antd/dist/antd.css';
// import { Card } from 'antd';
import { Typography } from 'antd';
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
      result: 0,
      totalcanceled: 0,
      totalnotcanceled: 0
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
          items {
            name
            column_values {
              id
              text
            }
          }
        }
      }`,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          const allData = []
          const canceled = []
          res.data.boards[0].items.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date" && field.text && moment().format("M") == moment(field.text).format("M")) {
                canceled.push(field.text)
              }
            })
          })
          this.setState({ totalcanceled: canceled.length })
          console.log("totalcanceled.length: ",canceled.length)
        });

      monday.api(`{
        items_by_multiple_column_values(board_id: 1676895469, column_id: "status_8", column_values: ["Lives Changes", "Call Back"]) {
          name
          column_values {
            id
            text
          }
        }
      }`,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          const allData = []
          const notcanceled = []
          res.data.items_by_multiple_column_values.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date" && field.text == "") {
                notcanceled.push(field.text)
              }
            })
          })
          this.setState({ totalnotcanceled: notcanceled.length })
          console.log("totalnotcanceled.length: ",notcanceled.length)

        });
    })


  }

  render() {
    return <div className="App" style={{ background: (this.state.settings.background) }}>
      {/* <Card title="Percentage Attempting Finance" extra={<FilterOutlined />} style={{ width: 400, marginLeft: 20 }}>
        <Title level={2}
          style={{ textAlign: 'center' }}
        >{(parseFloat((this.state.smartstylesCount / this.state.allItemsCount) * 100) || 0).toFixed(2)}%</Title>
      </Card> */}
      <div
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <h2>Percentage Attempting Finance</h2> */}
        <h2 style={{ fontSize: 75 }}>{(parseFloat((this.state.totalcanceled / this.state.totalnotcanceled) * 100) || 0).toFixed(1)}%</h2>
      </div>

    </div>;
  }
}

export default App;
