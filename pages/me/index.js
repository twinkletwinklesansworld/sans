import React from 'react';
import Layout from "../../components/Layout";
import {Avatar, Grid, Typography} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import {useSnackbar} from "notistack";

function Me(props) {
    const u = props.state.user

    const [avatarOpen, setAvatarOpen] = React.useState(false)
    const [avatarUpdating, setAvatarUpdating] = React.useState(false)
    const [updating, setUpdating] = React.useState(false)
    const [avatarURL, setAvatarURL] = React.useState('')
    const avatarRef = React.createRef()
    const [username, setUsername] = React.useState(undefined)
    const [email, setEmail] = React.useState(undefined)
    const [password, setPassword] = React.useState(undefined)
    const [newPassword, setNewPassword] = React.useState(undefined)

    const snackbar = useSnackbar()

    if (props.state.user) {
        if (props.state.user.username) {
            if (username === undefined) {
                setUsername(props.state.user.username)
            }
        } else {
            if (username === undefined) setUsername('')
        }
        if (props.state.user.email) {
            if (email === undefined) {
                setEmail(props.state.user.email)
            }
        } else {
            if (email === undefined) setEmail('')
        }
    }

    return (
        <Layout {...props}>
            {
                u ?
                    (
                        <>
                            <Grid container alignContent="center" alignItems="center" justify="center">
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <Typography align="center" component="div">
                                                    <Tooltip title="프로필 사진 변경">
                                                        <Avatar src={u.avatar} style={{
                                                            width: 100,
                                                            height: 100,
                                                            cursor: 'pointer',
                                                        }} onClick={() => {
                                                            setAvatarOpen(true)
                                                            setAvatarURL(u.avatar)
                                                        }}/>
                                                    </Tooltip>
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h4">{u.username || u.id}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{width: '100%'}}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField disabled={updating} label="닉네임"
                                                           variant="outlined" fullWidth value={username}
                                                           onChange={e => setUsername(e.target.value)}/>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField label="이메일" disabled={updating} type="email" variant="outlined"
                                                            fullWidth value={email}
                                                           onChange={e => setEmail(e.target.value)}/>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField label="비밀번호" variant="outlined" disabled={updating} fullWidth type="password"
                                                           onChange={e => setPassword(e.target.value)}/>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField label="새 비밀번호" variant="outlined" fullWidth disabled={updating} type="password"
                                                           onChange={e => setNewPassword(e.target.value)}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button disabled={updating} onClick={async () => {
                                                    setUpdating(true)
                                                    const d = await (await fetch('/api/user/update', {
                                                        method: 'PATCH',
                                                        body: JSON.stringify({
                                                            username, email, password, newPassword
                                                        }),
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            Authorization: 'Bearer ' + localStorage.getItem('token')
                                                        }
                                                    })).json()
                                                    if (d.error) {
                                                        snackbar.enqueueSnackbar(d.error, {
                                                            variant: 'error'
                                                        })
                                                        return setUpdating(false)
                                                    }
                                                    snackbar.enqueueSnackbar('성공적으로 처리되었습니다.', {
                                                        variant: 'success'
                                                    })
                                                    setUpdating(false)
                                                }} variant="contained" color="primary" style={{width: '100%'}}>
                                                    {updating ? <CircularProgress size={24}/> : '저장'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Dialog open={avatarOpen}>
                                <DialogTitle>프로필 사진 변경</DialogTitle>
                                <DialogContent>
                                    <input type="file" accept="image/*" ref={avatarRef} style={{display: 'none'}}
                                           onChange={e => {
                                               e.stopPropagation()
                                               e.preventDefault()
                                               const f = e.target.files[0]
                                               const reader = new FileReader()
                                               reader.addEventListener('load', () => {
                                                   setAvatarURL(reader.result)
                                               })
                                               if (f) reader.readAsDataURL(f)
                                           }}/>
                                    <Avatar onClick={() => !avatarUpdating && avatarRef.current.click()} src={avatarURL}
                                            style={{
                                                width: 200,
                                                height: 200
                                            }}/>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="secondary" onClick={() => {
                                        setAvatarOpen(false)
                                    }} disabled={avatarUpdating}>
                                        취소
                                    </Button>
                                    <Button color="primary" onClick={async () => {
                                        setAvatarUpdating(true)
                                        await fetch('/api/user/update', {
                                            headers: {
                                                Authorization: 'Bearer ' + localStorage.getItem('token'),
                                                'Content-Type': 'application/json'
                                            },
                                            method: 'PATCH',
                                            body: JSON.stringify({
                                                avatar: avatarURL || null
                                            })
                                        })
                                        await props.reloadUser()
                                        setAvatarUpdating(false)
                                        setAvatarOpen(false)
                                    }} disabled={avatarUpdating}>
                                        {
                                            avatarUpdating ? <CircularProgress size={24}/> : '저장'
                                        }
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    ) : '로그인 되어 있지 않습니다.'
            }
        </Layout>
    );
}

export default Me;
