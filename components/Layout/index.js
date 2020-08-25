import React, {Component} from 'react';
import {AppBar, Typography, Container, Avatar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import UserIcon from '@material-ui/icons/Person'
import Popover from "@material-ui/core/Popover";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {LockOpen, Person} from "@material-ui/icons";


class Layout extends Component {
    state = {
        token: null,
        userPopup: null
    }

    componentDidMount() {
        this.setState({
            token: localStorage.getItem('token')
        })
    }

    render() {
        return (
            <div style={{
                height: '100vh'
            }}>
                <AppBar position="fixed" style={{
                    boxShadow: 'none'
                }}>
                    <Toolbar>
                        <Link href="/">
                            <Typography variant="h6" style={{
                                cursor: 'pointer'
                            }}>
                                반짝반짝샌즈월드
                            </Typography>
                        </Link>
                        <div style={{flexGrow: 1}}/>
                        {
                            this.state.token ?
                                <>
                                    <IconButton color="inherit"
                                                onClick={e => this.setState({userPopup: e.currentTarget})}>
                                        <UserIcon/>
                                    </IconButton>
                                    <Popover open={Boolean(this.state.userPopup)} anchorEl={this.state.userPopup}
                                             onBackdropClick={() => this.setState({userPopup: null})}>
                                        {
                                            this.props.state.user && (
                                                <>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Avatar src={this.props.state.user.avatar || undefined}/>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={`${this.props.state.user && this.props.state.user.id}`}/>
                                                    </ListItem>
                                                    <Link href="/u/[id]" as={`/u/${this.props.state.user.id}`}>
                                                        <ListItem button>
                                                            <ListItemIcon>
                                                                <Person/>
                                                            </ListItemIcon>
                                                            <ListItemText primary="프로필"/>
                                                        </ListItem>
                                                    </Link>
                                                    <ListItem button onClick={() => {
                                                        localStorage.removeItem('token')
                                                        this.setState({token: undefined})
                                                        this.props.setState({user: null})
                                                    }}>
                                                        <ListItemIcon>
                                                            <LockOpen/>
                                                        </ListItemIcon>
                                                        <ListItemText primary="로그아웃"/>
                                                    </ListItem>
                                                </>
                                            )
                                        }
                                    </Popover>
                                </> :
                                <Link href="/login">
                                    <Button color="inherit">
                                        로그인
                                    </Button>
                                </Link>
                        }
                    </Toolbar>
                </AppBar>
                <Container style={{
                    height: '100%'
                }}>
                    <Toolbar style={{
                        marginTop: 20
                    }}/>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}

export default Layout;
