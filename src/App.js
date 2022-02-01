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

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import ReactLoading from "react-loading";

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
      filterBy: "All",
      boardData: {},
      totalConverted: 0,
      totalLead: 0,
      people: []
    };
    this.getMenuItem()
  }

  getMenuItem = () => {
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
          const allPeople = []

          res.data.boards[0].items.map(item => allData.push(item.column_values))

          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "people" && (field.text != "" && field.text != "null" && field.text != undefined)) {
                if (!allPeople.includes(field.text)) {
                  allPeople.push(field.text)
                }
              }
            })
          })

          console.log("res.data", allPeople)
          this.setState({
            people: allPeople
          })

        });

    })
  }

  syncData = () => {
    this.setState({ loading: true })

    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });
    // TODO: set up event listeners
    monday.listen("context", res => {
      this.setState({ context: res.data });
      console.log(res.data);
      monday.api(this.state.filterBy == "All" ? `{
        boards(ids: 1890240262) {
          items {
            name
            column_values {
              id
              text
            }
          }
        }
      }` : `{
        items_by_multiple_column_values(board_id: 1890240262, column_id: "people", column_values: ["${this.state.filterBy}"]) {
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
          const totalConverted = []
          const totalLead = []
          const allPeople = []

          if (res.data.boards) {
            res.data.boards[0].items.map(item => allData.push(item.column_values))
          } else {
            res.data.items_by_multiple_column_values.map(item => allData.push(item.column_values))
          }

          allData.map((item, i) => {
            item.map(field => {
              if (field.id == "date4" && field.text && moment().format("M") == moment(field.text).format("M")) {
                totalLead.push(i)
              }
            })
          })

          this.setState({
            totalLead: totalLead.length,
            loading: false
          })


        });

    })
  }


  componentDidMount() {
    this.syncData()
  }

  handleChange = (event) => {
    console.log(event.target.value)
    this.setState({ filterBy: event.target.value });
    this.syncData()
  };

  render() {
    return <div className="App" style={{ background: (this.state.settings.background) }}>
      {/* <Card title="Percentage Attempting Finance" extra={<FilterOutlined />} style={{ width: 400, marginLeft: 20 }}>
        <Title level={2}
          style={{ textAlign: 'center' }}
        >{(parseFloat((this.state.smartstylesCount / this.state.allItemsCount) * 100) || 0).toFixed(2)}%</Title>
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
            <InputLabel id="demo-simple-select-label">People</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.filterBy}
              label={"people"}
              onChange={(e) => this.handleChange(e)}
              disabled={this.state.loading}
            >
              <MenuItem value={"All"}>All</MenuItem>
              {this.state.people.map((item, i) => <MenuItem value={item} key={i}>{item}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <div
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <h2>Percentage Attempting Finance</h2> */}
        {this.state.loading && <div style={{ margin: "auto", maxWidth: 71 }}>
          <ReactLoading type={"bubbles"} color="#0073ea" />
        </div>}
        {!this.state.loading && <h2 style={{ fontSize: 75 }}>{this.state.totalLead || 0}</h2>}
      </div>

    </div>;
  }
}

export default App;
