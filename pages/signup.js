import React, {Component} from 'react';
import Layout from "../components/Layout";
import Grid from "@material-ui/core/Grid";
import {Card, CardContent, Typography} from '@material-ui/core'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import {withSnackbar} from "notistack";

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
                        <Card style={{marginTop: 100}}>
                            <CardContent>
                                <Typography variant="h6" align="center">회원가입</Typography>
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
                                                const data = await (await fetch('/api/user/signup', {
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
                                                if (data.status === 'success') {
                                                    this.props.enqueueSnackbar('회원가입이 완료되었습니다. 로그인 해주세요.', {
                                                        variant: 'success'
                                                    })
                                                }
                                            }} disabled={this.state.processing} style={{
                                                width: '100%'
                                            }}>가입하기</Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Link href="/login">
                                                <Button variant="contained" color="primary"  style={{
                                                    width: '100%'
                                                }}>로그인</Button>
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