import React, {Component} from 'react';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import NextProgress from 'nextjs-progressbar'
import {MuiThemeProvider, withTheme} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import '../styles/globals.css'
import {SnackbarProvider} from "notistack";
import blue from '@material-ui/core/colors/blue'

class RootApp extends Component {
    async componentDidMount() {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
        await this.update.bind(this)()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        await this.update.bind(this)()
    }

    async update() {
        if (!this.state.user) {
            if (localStorage.getItem('token')) {
                const data = await (await fetch('/api/user/identify', {
                    headers: {
                        Authorization: 'Bearer ' + encodeURIComponent(localStorage.getItem('token'))
                    }
                })).json()
                if (data.error) {
                    alert('오류로 로그아웃 되었습니다: ' + data.error)
                    localStorage.removeItem('token')
                    this.setState({
                        user: undefined
                    })
                }
                this.setState({user: data})
            }
        }
    }

    state = {
        user: null
    }

    render() {
        const {Component, ...other} = this.props;

        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: blue['600']
                }
            }
        });

        return (
            <MuiThemeProvider theme={theme}>
                <Head>
                    <title>반짝반짝샌즈월드</title>
                    <meta charSet="utf-8"/>
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no"/>
                    <meta name="description" content="반짝반짝샌즈월드"/>
                    <meta name="keywords" content="nextjs,static,website"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                </Head>
                <CssBaseline/>
                <NextProgress color="#000"/>
                <SnackbarProvider maxSnack={4}>
                    <Component state={this.state} setState={this.setState.bind(this)} {...other} />
                </SnackbarProvider>
            </MuiThemeProvider>
        );
    }
}

export default withTheme(RootApp)
