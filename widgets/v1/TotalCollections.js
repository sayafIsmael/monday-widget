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
      collected: 0,
      merchantfee: 0,
      merchantfeeSplit: 0
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
          const collected = []
          const merchantfee = []
          const merchantfeeSplit = []

          res.data.boards[0].items.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "numbers_19" && field.text) {
                collected.push(field.text)
              }
              if (field.id == "numbers_2" && field.text) {
                merchantfee.push(field.text)
              }
              if (field.id == "numbers_3" && field.text) {
                merchantfeeSplit.push(field.text)
              }
            })
          })
          
          this.setState({
            collected: collected.reduce((a, b) => Number(a) + Number(b), 0),
            merchantfee: merchantfee.reduce((a, b) => Number(a) + Number(b), 0),
            merchantfeeSplit: merchantfeeSplit.reduce((a, b) => Number(a) + Number(b), 0),
          })

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
        <h2 style={{ fontSize: 75 }}>${(parseFloat((this.state.collected - this.state.merchantfee) + this.state.merchantfeeSplit) || 0).toFixed(1)}</h2>
      </div>

    </div>;
  }
}

export default App;
