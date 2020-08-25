import React, {Component} from 'react';
import Layout from "../components/Layout";
import Grid from "@material-ui/core/Grid";
import {Card, CardContent, Typography} from '@material-ui/core'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from 'next/link'
import {withSnackbar} from "notistack";
import Router from "next/router";

class Login extends Component {
    state = {
        processing: false,
        id: '',
        password: ''
    }

    render() {
        return (
            <Layout {...this.props}>
                <Grid container style={{height: '100%'}} direction="row" alignItems="center" justify="center" alignContent="center">
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">로그인</Typography>
                                <Grid item>
                                    <TextField color="secondary" required onChange={e => this.setState({id: e.target.value})} label="아이디" type="email" fullWidth style={{marginBottom: 10}}/>
                                    <TextField color="secondary" required onChange={e => this.setState({password: e.target.value})} label="비밀번호" type="password" fullWidth style={{marginBottom: 10}}/>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Button variant="contained" color="primary" onClick={async () => {
                                                this.props.enqueueSnackbar('처리중...', {
                                                    variant: 'info'
                                                })
                                                this.setState({processing: true})
                                                const data = await (await fetch('/api/user/login', {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        id: this.state.id,
                                                        password: this.state.password
                                                    }),
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                })).json()
                                                if (data.error) {
                                                    this.setState({
                                                        processing: false
                                                    })
                                                    return this.props.enqueueSnackbar(data.error, {
                                                        variant: 'error'
                                                    })
                                                }
                                                if (data.token) {
                                                    this.props.enqueueSnackbar('로그인 되었습니다.', {
                                                        variant: 'success'
                                                    })
                                                    localStorage.setItem('token', data.token)
                                                    await Router.push('/')
                                                }
                                            }} disabled={this.state.processing} style={{
                                                width: '100%'
                                            }}>로그인</Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Link href="/signup">
                                                <Button variant="contained" color="primary" style={{
                                                    width: '100%'
                                                }}>가입하기</Button>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Layout>
        );
    }
}

export default withSnackbar(Login);
