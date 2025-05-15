import React, {Component} from 'react';
import cl from './Fortune.css';
import axios from 'axios'

class App extends Component {
    
    constructor(props) {
        
        super(props);
        
        this.onChange = this.onChange.bind(this);
        
        this.state = {
            header : ["name","rank","year","industry","sector","headquarters_state","headquarters_city"],
            records: []
        };
       
    };
    
    componentDidMount() {
        axios({method:'get', url: window.origin + '/' + 'fortune?year=2023'})
        .then((response)=>{
            this.setState({records: response.data })
        })
    }
    onChange(event) {
        console.log(event.currentTarget.value)
        
        axios({method:'get', url: window.origin + '/' + 'fortune' + `?year=${event.currentTarget.value}`})
        .then((response)=>{
            this.setState({records: response.data })
        })
    }

    render() {
        return (
            <div className={cl.container}>

                <h1> Fortune 500 </h1>
                
                <p> Annual list of 500 biggest 
                    United States companies by revenue</p>
                
                    <select onChange={this.onChange} name="choice">
                        <option value='2023'>2023</option>
                        <option value='2022'>2022</option>
                        <option value='2021'>2021</option>
                        <option value='2020'>2020</option>
                    </select>

                {/* Div generates a header which is static during page event. This is 'frozen'. */}
                <div className={cl.table_container_skinny}>
                    <table>

                        <thead>
                            <tr>
                                {
                                    this.state.header.map((ele, index) => {return (<th className={index == 6? '' :cl.header1} key={index} scope='col'> {ele} </th>)} )
                                }
                            </tr>
                        </thead>

                        <tbody>
                            {
                                this.state.records.map( (arr, index) => {
                                    return (
                                        <tr>
                                            <td scope='row'> {arr[0]} </td>
                                            <td scope='row'> {arr[1]} </td>
                                            <td scope='row'> {arr[2]} </td>
                                            <td scope='row'> {arr[3]} </td>
                                            <td scope='row'> {arr[4]} </td>
                                            <td scope='row'> {arr[5]} </td>
                                            <td scope='row'> {arr[6]} </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                        <tfoot>
                            <tr>
                                    {
                                        this.state.header.map((ele, index) => {return (<th className={cl.header1} key={index} scope='col'> {ele} </th>)} )
                                    }
                                </tr>
                        </tfoot>

                    </table>
                </div>

                {/* Div generates table body of data. */}

                <div className={cl.table_container}>
                    <table>
                    
                        <thead>
                            {/* <tr>
                                {
                                    this.state.header.map((ele, index) => {return (<th className={index == 6? '' :cl.header1} key={index} scope='col'> {ele} </th>)} )
                                }
                            </tr> */}
                        </thead>
                        
                        <tbody>
                            {
                               this.state.records.map( (arr, index) => {
                                    return (
                                        <tr>
                                            <td scope='row'> {arr[0]} </td>
                                            <td scope='row'> {arr[1]} </td>
                                            <td scope='row'> {arr[2]} </td>
                                            <td scope='row'> {arr[3]} </td>
                                            <td scope='row'> {arr[4]} </td>
                                            <td scope='row'> {arr[5]} </td>
                                            <td scope='row'> {arr[6]} </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        
                        <tfoot>
                            <tr>
                                {
                                    this.state.header.map((ele, index) => {return (<th className={cl.header1} key={index} scope='col'> {ele} </th>)} )
                                }
                            </tr>
                        </tfoot>

                    </table>

                </div>

            </div>
        );
    }

}

export default App;