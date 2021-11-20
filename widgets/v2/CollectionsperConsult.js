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
      paymentstatusCount: 0
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
          items_by_multiple_column_values(board_id: 1676895469, column_id: "status", column_values: ["Collected"]) {
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
          console.log("Res paymentstatusCount:", res.data.items_by_multiple_column_values.length)
          const allData = []
          const paymentstatus = []

          res.data.items_by_multiple_column_values.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                paymentstatus.push(field.id)
              }
            })
          })
          this.setState({ paymentstatusCount: paymentstatus.length })
          console.log("paymentstatusCount:",   paymentstatus.length)

        });
    })


  }

  render() {
    return <div className="App" style={{ background: (this.state.settings.background), overflow: 'hidden' }}>
      {/* <Card title="Percentage Attempting Finance" extra={<FilterOutlined />} style={{ width: 400, marginLeft: 20 }}>
        <Title level={2}
          style={{ textAlign: 'center' }}
        >{(parseFloat((this.state.filteredStatusCount / this.state.allItemsCount) * 100) || 0).toFixed(2)}%</Title>
      </Card> */}
      <div
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* <h2>Percentage Attempting Finance</h2> */}
        <h2 style={{ fontSize: 75 }}>{(parseFloat((this.state.paymentstatusCount / this.state.allItemsCount) * 100) || 0).toFixed(1)}%</h2>
      </div>

    </div>;
  }
}

export default App;
