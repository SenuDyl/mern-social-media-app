import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizonOutlined
} from '@mui/icons-material';
import { Box, Typography, useTheme, Divider, InputBase, Button, IconButton, useMediaQuery } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import DropZone from 'react-dropzone';
import WidgetWrapper from '../../components/WidgetWrapper';
import UserImage from '../../components/UserImage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state'

const MyPostWidget = () => {
    const dispatch = useDispatch()
    const [isImage, setIsImage] = useState(false)
    const [image, setImage] = useState(null)
    const [post, setPost] = useState('')
    const { palette } = useTheme()
    const { _id } = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const isNonMobileScreens = useMediaQuery('(min-width:1000px)')
    const mediumMain = palette.neutral.mediumMain
    const medium = palette.neutral.medium

    const handlePost = async () => {
        const formData = new formData()
        formData.append("userId", _id)
        formData.append("description", post)
        if (image) {
            formData.append("picture", image)
            formData.append("picturePath", image.name)
        }
        const response = await fetch('http//localhost:3001/posts', {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        })
        const posts = await response.json()
        dispatch(setPosts({ posts }))
        setImage(null)
        setPost('')
    }
    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase
                    placeholder='What is on your mind?'
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />

            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <DropZone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => {
                            setFieldValue("picture", acceptedFiles[0])
                        }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <Box
                                border={`2px dashed ${palette.neutral.main}`}
                                p="1rem"
                                sx={{ "&:hover": { cursor: "pointer" } }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />

                                {!values.picture ? (
                                    <p>Add Picture Here</p>
                                ) : (
                                    <FlexBetween>
                                        <Typography>{values.picture.name}</Typography>
                                        <EditOutlinedIcon />
                                    </FlexBetween>
                                )}
                            </Box>
                        )}
                    </DropZone>

                </Box>
            )}
        </WidgetWrapper>
    )
}