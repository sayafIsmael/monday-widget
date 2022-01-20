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
      liveschangesCount: 0,
      callBack: [],
      pipeline: [],
      smileStyledScheduled: [],
      sameDayLifeChanged: [],
      cancelled: [],
      numberOfitems: []
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
          const finalData = []
          console.log("res.data: ",res.data.boards[0].items)
          res.data.boards[0].items.map(item => allData.push(item.column_values))

          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                finalData.push(field.id)
              }
            })
          })

          this.setState({ allItemsCount: finalData.length })
          console.log("allData.length: ",finalData.length )
          
        });
      monday.api(`{
        items_by_multiple_column_values(board_id: 1676895469, column_id: "status_8",
        column_values: ["Same Day Life Changed", "Call Back", "Pipeline", "Cancelled", "Smile Style Scheduled"]) {
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
          const callBack = []
          const pipeline = []
          const smileStyledScheduled = []
          const sameDayLifeChanged = []
          const cancelled = []
          const numberOfitems = []

          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "status_8" && (field.text == "Pipeline")) {
                if (field.id == "date9" && field.text && moment().format("M") == moment(field.text).format("M")) {
                  pipeline.push(field.id)
                }
              }
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                numberOfitems.push(field.text)

                allData[i].map(_data => {
                  if (_data.id == "status_16" && _data.text == "Huntington Beach") {
                    allData[i].map(field2 => {

                      if (field2.id == "status_8" && (field2.text == "Call Back")) {
                        console.log("callBack: ", field2.id)
                        callBack.push(field2.id)
                      }
                      if (field2.id == "status_8" && (field2.text == "Smile Style Scheduled")) {
                        smileStyledScheduled.push(field2.id)
                      }
                      if (field2.id == "status_8" && (field2.text == "Same Day Life Changed")) {
                        sameDayLifeChanged.push(field2.id)
                      }
                      if (field2.id == "status_8" && (field2.text == "Cancelled")) {
                        cancelled.push(field2.id)
                      }


                      // if (field2.id == "status_4" && field2.text == "" || field2.text == null) {
                      //   allData[i].map(field3 => {
                      //     if (field3.id == "numbers_14" && Number(field3.text) > 1000) {
                      //       console.log("field3.text > 1000: ", field3.text)
                      //       tcr.push(1.5)
                      //     }
                      //     if (field3.id == "numbers_14") {
                      //       console.log("field3.text: ", field3.text)

                      //       tcr.push(1)
                      //     }
                      //   })
                      // }
                    })
                  }
                })

              }
            })
          })

          this.setState({ callBack, pipeline, smileStyledScheduled, sameDayLifeChanged, cancelled, numberOfitems })

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

  getCallbackValue() {
    let res = parseFloat(this.state.callBack.length) / parseFloat(this.state.allItemsCount)
    // console.log("getCallbackValue: ", this.state.callBack.length, this.state.allItemsCount)
    let add = parseFloat(res) * .04
    return (parseFloat(res) + parseFloat(add)) * parseFloat(this.state.callBack.length)
  }

  getPipelineValue() {
    return (parseFloat(this.state.pipeline.length) / parseFloat(this.state.allItemsCount)) * parseFloat(this.state.pipeline.length)
  }

  getSmileStyledScheduledValue() {
    return (parseFloat(this.state.smileStyledScheduled.length) / parseFloat(this.state.allItemsCount)) * parseFloat(this.state.smileStyledScheduled.length)
  }

  getSameDayLifeChangedValue() {
    return parseFloat(this.state.sameDayLifeChanged.length) / parseFloat(this.state.allItemsCount) * parseFloat(this.state.sameDayLifeChanged.length)
  }

  getCancelledValue() {
    let res = parseFloat(this.state.cancelled.length) / parseFloat(this.state.allItemsCount)
    console.log("cancelledValue: ", this.state.cancelled.length)
    let add = parseFloat(res) * .05
    return (parseFloat(res) + parseFloat(add)) * parseFloat(this.state.cancelled.length)
  }

  getData() {
    console.log("this.getCallbackValue()", this.getCallbackValue())
    console.log("this.getPipelineValue()", this.getPipelineValue())
    console.log("this.getSmileStyledScheduledValue()", this.getSmileStyledScheduledValue())
    console.log("this.getSameDayLifeChangedValue()", this.getSameDayLifeChangedValue())
    console.log("this.getCancelledValue()", this.getCancelledValue())

    return (this.getCallbackValue() - this.getPipelineValue() + this.getSmileStyledScheduledValue() + this.getSameDayLifeChangedValue() - this.getCancelledValue()) / this.state.numberOfitems.length
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
        <h2 style={{ fontSize: 75 }}>{((this.getData() * 100) || 0).toFixed(1)}%</h2>
      </div>

    </div>;
  }
}

export default App;