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
      totalConvertedBlank: 0,
      totalConverted: 0
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
        boards(ids: 1890240262) {
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
          const totalConvertedBlank = []
          const totalConverted = []
          const totalLead = []

          res.data.boards[0].items.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                totalLead.push(field.text)
                //     // console.log("date ok")
                //     // allData[i].map(field2 => {
                //     if (field.id == "date4" && (field.text != null || field.text != "")) {
                //         console.log("status null push ok")
                //         totalConvertedBlank.push(field.text)
                //     }
                //     // })
                //     // }
                allData[i].map(field3 => {
                  if (field3.id == "status" && field3.text == "Converted") {
                    console.log("status Convert push ok")
                    totalConverted.push(field3.text)
                  }
                })
              }
            })

          })

          // if (totalConverted.length && totalConvertedBlank.length) {
          this.setState({
            totalConverted: totalConverted.length || 0,
            totalLead: totalLead.length
            // totalConvertedBlank: totalConvertedBlank.length || 0
          })
          // }
          console.log({
            totalConverted: totalConverted.length || 0,
            totalLead: totalLead.length
            // totalConvertedBlank: totalConvertedBlank.length || 0
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
        <h2 style={{ fontSize: 75 }}>{((parseFloat(this.state.totalConverted) / parseFloat(this.state.totalLead)) * 100 || 0).toFixed(1)}%</h2>
      </div>

    </div>;
  }
}

export default App;
