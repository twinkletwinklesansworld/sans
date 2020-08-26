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

function Me(props) {
    const u = props.state.user

    const [avatarOpen, setAvatarOpen] = React.useState(false)
    const [avatarUpdating, setAvatarUpdating] = React.useState(false)
    const [avatarURL, setAvatarURL] = React.useState('')
    const avatarRef = React.createRef()

    return (
        <Layout {...props}>
            {
                u ?
                    (
                        <>
                            <Grid container alignContent="center" alignItems="center" justify="center">
                                <>
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
                                </>
                            </Grid>
                            <Dialog open={avatarOpen}>
                                <DialogTitle>프로필 사진 변경</DialogTitle>
                                <DialogContent>
                                    <input type="file" accept="image/*" ref={avatarRef} style={{display: 'none'}} onChange={e => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        const f = e.target.files[0]
                                        const reader = new FileReader()
                                        reader.addEventListener('load', () => {
                                            setAvatarURL(reader.result)
                                        })
                                        if (f) reader.readAsDataURL(f)
                                    }}/>
                                    <Avatar onClick={() => !avatarUpdating && avatarRef.current.click()} src={avatarURL} style={{
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
