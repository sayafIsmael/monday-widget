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
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import ReactLoading from "react-loading";
import CircularProgress from '@mui/material/CircularProgress';


const { Title } = Typography;

const monday = mondaySdk();

class App extends React.Component {
  // const [age, setAge] = React.useState('');

  handleChange = (event) => {
    console.log(event.target.value)
    this.setState({ filterBy: event.target.value });
    this.syncData()
  };

  constructor(props) {
    super(props);

    // Default state
    this.state = {
      loading: false,
      filterBy: 2,
      context: {},
      settings: {},
      name: "",
      boardData: {},
      filteredStatusCount: 0,
      allItemsCount: 0,
      paymentstatusCount: 0,
      projectionAmounts: 0,
      collectionAmounts: 0
    };
  }

  syncData = () =>{
    this.setState({loading: true})
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
          console.log("Res paymentstatusCount:", res.data.boards[0].items.length)
          const allData = []
          const count = []

          res.data.boards[0].items.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                count.push(field.id)
              }
            })
          })
          this.setState({ allItemsCount: count.length })
          console.log("count.length: ", count.length)

        });
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
          console.log("Res paymentstatusCount:", res.data.boards[0].items.length)
          const allData = []
          const projectionAmounts = []
          const collectionAmounts = []

          res.data.boards[0].items.map(item => allData.push(item.column_values))
          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                allData[i].map((_data) => {
                  if (this.state.filterBy === 2) {
                    if (_data.id == "status_16" && _data.text == "Huntington Beach") {
                      allData[i].map((_data_) => {
                        if (_data_.id == "numbers_13" && _data_.text) {
                          projectionAmounts.push(_data_.text)
                        }
                      })
                      allData[i].map((_data_) => {
                        if (_data_.id == "numbers_19" && _data_.text) {
                          collectionAmounts.push(_data_.text)
                        }
                      })
                    }
                  }
                  if (this.state.filterBy === 1) {
                    allData[i].map((_data_) => {
                      if (_data_.id == "numbers_13" && _data_.text) {
                        projectionAmounts.push(_data_.text)
                      }
                    })
                    allData[i].map((_data_) => {
                      if (_data_.id == "numbers_19" && _data_.text) {
                        collectionAmounts.push(_data_.text)
                      }
                    })
                  }

                })
              }
            })
          })

          this.setState({
            projectionAmounts: projectionAmounts.reduce((a, b) => Number(a) + Number(b), 0),
            collectionAmounts: collectionAmounts.reduce((a, b) => Number(a) + Number(b), 0),
            loading: false
          })
        });
    })
  }

  componentDidMount() {
    this.syncData()
  }

  render() {
    return <div className="App" style={{ background: (this.state.settings.background), overflow: 'hidden' }}>
      {/* <Card title="Percentage Attempting Finance" extra={<FilterOutlined />} style={{ width: 400, marginLeft: 20 }}>
        <Title level={2}
          style={{ textAlign: 'center' }}
        >{(parseFloat((this.state.filteredStatusCount / this.state.allItemsCount) * 100) || 0).toFixed(2)}%</Title>
      </Card> */}
      <Stack
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{}}
      >

        <Box sx={{ minWidth: 120, maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.filterBy}
              label="Age"
              onChange={(e) => this.handleChange(e)}
              disabled={this.state.loading}
            >
              <MenuItem value={1}>All</MenuItem>
              <MenuItem value={2}>Huntington Beach Only</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>

      <div
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* <h2>Percentage Attempting Finance</h2> */}
        {this.state.loading && <ReactLoading type={"bubbles"} color="primary" />}
        {!this.state.loading && <h2 style={{ fontSize: 75 }}>${parseFloat((Number(this.state.collectionAmounts) / this.state.allItemsCount) || 0).toFixed(1)}</h2>}
      </div>

    </div>;
  }
}

export default App;
