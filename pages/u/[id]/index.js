import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {Avatar, CardContent, Icon, Typography} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {withSnackbar} from "notistack";

class Profile extends Component {
    componentDidMount() {
        this.update()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.update()
        }
    }

    async update() {
        if (this.props.router.query.id) {
            this.setState({
                data: await (await fetch('/api/u/' + this.props.router.query.id)).json(),
                loading: false
            })
        }
    }

    state = {
        data: null,
        loading: true
    }

    render() {
        const user = this.state.data
        const loading = !this.state.data && this.state.loading
        const u = this.props.state.user

        return (
            <Layout {...this.props}>
                {loading ? 'Loading...' : <>
                    {
                        !user.error ?
                            <Grid container justify="center">
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <Avatar style={{
                                                        width: 100,
                                                        height: 100
                                                    }} src={user.avatar}/>
                                                    <Typography align="center">
                                                        팔로워 {user.followers.length}명
                                                    </Typography>
                                                    <Typography align="center">
                                                        {user.following.length}명 팔로우중
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h5">
                                                        {user.username || user.id}
                                                    </Typography>
                                                    {
                                                        user.username && <Typography>
                                                            {user.id}
                                                        </Typography>
                                                    }
                                                    <AvatarGroup>
                                                        {
                                                            user.roles.map((role, i) => (
                                                                <Avatar style={{
                                                                    background: role.color,
                                                                }} key={i}>
                                                                    <Tooltip title={role.name}>
                                                                        <Icon>{role.icon}</Icon>
                                                                    </Tooltip>
                                                                </Avatar>
                                                            ))
                                                        }
                                                    </AvatarGroup>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        {
                                            u && this.props.router.query.id !== u.id && <DialogActions>
                                                <Button color="primary" onClick={async () => {
                                                    const data = await (await fetch(`/api/u/${this.props.router.query.id}/follow`, {
                                                        headers: {
                                                            Authorization: 'Bearer ' + localStorage.getItem('token')
                                                        }
                                                    })).json()
                                                    if (data.error) {
                                                        this.props.enqueueSnackbar(data.error, {
                                                            variant: 'error'
                                                        })
                                                    }
                                                    if (data.code === 200) {
                                                        this.props.reloadUser()
                                                    }
                                                }}>
                                                    {
                                                        user.followers.includes(u.id) ?
                                                            '팔로우 취소' : '팔로우'
                                                    }
                                                </Button>
                                            </DialogActions>
                                        }
                                    </Card>
                                </Grid>
                            </Grid>
                            : '그런 사람 모릅니다'
                    }
                </>}
            </Layout>
        );
    }
}

export default withSnackbar(Profile)
