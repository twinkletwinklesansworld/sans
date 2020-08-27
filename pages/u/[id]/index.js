import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {Avatar, CardContent, Icon, Typography} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import AvatarGroup from "@material-ui/lab/AvatarGroup";

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
        console.log(user)

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
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h5">
                                                        {user.username || user.id}
                                                    </Typography>
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

export default Profile
