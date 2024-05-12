const jwt = require('jsonwebtoken');
const axios = require('axios');
const config = require('../config');
const userModel = require('../models/userSchema');
const postModel = require('../models/postSchema');
const postLikeModel = require('../models/postLikeSchema');
const postCommentModel = require('../models/postCommentSchema');
const { validateKoreaDate } = require('../modules/util/validation');

const createLoungePostService = async (authorization, body, files) => {
  const postBody = body.body;
  const postLink = JSON.parse(body.link);
  // find files
  const imageList = [];
  if (files.length) {
    files.map(item => {
      const imageObject = { origin: item.location };
      imageList.push(imageObject);
    });
  }
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해 주세요.');
  }
  if (!postLink.link && !postBody) {
    throw Error('링크 또는 바디를 입력해 주세요.');
  }
  // create post
  const post = new postModel({
    userId: decode.id,
    postType: 'lounge',
    body: body.body ? body.body : null,
    link: postLink.link ? postLink.link : null,
    images: imageList.length ? imageList : null,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await post.save();
  // web hooks
  if (config.env === 'production') {
    await axios.post(
      'https://hooks.slack.com/services/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',
      { text: `${decode.id}님이 게시글을 작성했습니다. "${body.body}"` },
    );
  }
  // Response
  const resultData = {
    postId: post._id,
  };
  return resultData;
};

const readLoungePostDetailService = async (authorization, postId) => {
  // verify user
  let decode = {
    id: 0,
  };
  if (authorization) {
    decode = jwt.verify(authorization, config.jwtSecretKey);
  }
  // verify post
  const post = await postModel.findOne({ _id: postId, deleteAt: null });
  if (!post) {
    throw Error('게시글 정보를 확인해 주세요.');
  }
  if (post.deleteAt !== null) {
    throw Error('삭제된 게시글입니다.');
  }
  // find author
  const author = await userModel.findOne({ userId: post.userId });
  // find post like
  const postLikes = await postLikeModel.find({
    postId,
    userLike: true,
  });
  // find postList my Status
  const postListMyData = await postLikeModel.findOne({
    userId: decode.id,
    postId,
    userLike: true,
  });
  const postLikeDetails = await Promise.all(
    postLikes.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        _id: item.id,
        userDetail: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
      };
    }),
  );
  // find post comment
  const postComment = await postCommentModel
    .find({
      postType: 'lounge',
      postId,
      deleteAt: null,
    })
    .sort({ createAt: 1 });
  const postCommentDetails = await Promise.all(
    postComment.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      return {
        _id: item._id,
        comment: item.comment,
        createAt: item.createAt,
        updateAt: item.updateAt,
        userDetail: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
      };
    }),
  );
  // Response
  const resultData = {
    postDetail: {
      postInfo: post,
      authorInfo: author,
      postLikes: {
        count: postLikeDetails.length,
        myStatus: !!postListMyData,
        userList: postLikeDetails.length ? postLikeDetails : null,
      },
      postComments: {
        count: postCommentDetails.length,
        commentList: postCommentDetails.length ? postCommentDetails : null,
      },
    },
  };
  return resultData;
};

const readLoungePostListService = async (
  authorization,
  offset = 0,
  limit = 999,
) => {
  // verify user
  let decode = {
    id: 0,
  };
  if (authorization) {
    decode = jwt.verify(authorization, config.jwtSecretKey);
    const user = userModel.findOne({
      userId: decode.id,
    });
    if (!user) {
      throw Error('유저 정보를 확인해주세요.');
    }
  }
  // find lounge post
  const posts = await postModel
    .find({ postType: 'lounge', deleteAt: null })
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);
  const count = await postModel.find({ postType: 'lounge' }).count();
  const postDetails = await Promise.all(
    posts.map(async item => {
      const userDetail = await userModel.findOne({ userId: item.userId });
      const postLikes = await postLikeModel.find({
        postId: item.id,
        userLike: true,
      });
      // find postList my Status
      const postListMyData = await postLikeModel.findOne({
        userId: decode.id,
        postId: item.id,
        userLike: true,
      });
      // find post comment
      const postComment = await postCommentModel.find({
        postId: item.id,
        deleteAt: null,
      });
      return {
        postInfo: item,
        authorInfo: {
          userId: userDetail.userId,
          name: userDetail.name,
          email: userDetail.email,
          introduce: userDetail.introduce,
          profileImage: userDetail.profileImage,
          company: userDetail.company,
        },
        postLikes: {
          count: postLikes.length,
          myStatus: !!postListMyData,
        },
        postComments: {
          count: postComment.length,
        },
      };
    }),
  );
  // Response
  const resultData = {
    postCount: count,
    postList: postDetails || null,
  };
  return resultData;
};

const updateLoungePostService = async (authorization, body, files) => {
  const { postId } = body;
  const postBody = body.body;
  const postLink = JSON.parse(body.link);
  const postEditImage = JSON.parse(body.editImage);
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify post
  if (!postLink.link && !postBody) {
    throw Error('링크 또는 바디를 입력해 주세요.');
  }
  // verify loungeId
  const post = await postModel.findOne({
    _id: postId,
  });
  if (!post) {
    throw Error('랩 정보를 확인해 주세요.');
  }
  // verify author
  const author = await postModel.findOne({
    _id: postId,
    userId: decode.id,
  });
  if (!author) {
    throw Error('작성자를 확인해 주세요.');
  }
  // find files
  const imageList = [...postEditImage];
  if (files.length) {
    files.map(item => {
      const imageObject = { origin: item.location };
      imageList.push(imageObject);
    });
  }
  await postModel.updateOne(
    { _id: postId },
    {
      body: body.body ? body.body : null,
      link: postLink.link ? postLink.link : null,
      images: imageList.length ? imageList : null,
      updateAt: validateKoreaDate(new Date()),
    },
  );
};

const updateLoungePostLikeService = async (authorization, postId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify postId
  const post = await postModel.findOne({
    _id: postId,
  });
  if (!post) {
    throw Error('게시글 정보를 확인해 주세요.');
  }
  // find lab like
  const postLike = await postLikeModel.findOne({
    postId,
    userId: decode.id,
  });
  // update or create lab like
  if (postLike) {
    await postLikeModel.updateOne(
      { postId, userId: decode.id },
      { userLike: !postLike.userLike, updateAt: validateKoreaDate(new Date()) },
    );
  } else {
    const postLike = new postLikeModel({
      postId,
      userId: decode.id,
      userLike: true,
      createAt: validateKoreaDate(new Date()),
      updateAt: validateKoreaDate(new Date()),
    });
    await postLike.save();
  }
};

const deleteLoungePostService = async (authorization, postId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify post
  const post = await postModel.findOne({
    _id: postId,
  });
  if (!post) {
    throw Error('게시글 정보를 확인해 주세요.');
  }
  const author = await postModel.findOne({
    _id: postId,
    userId: decode.id,
  });
  if (!author) {
    throw Error('작성자를 확인해 주세요.');
  }
  // Todo. 이미 삭제된 조건 처리
  // delete lab comment
  await postModel.updateOne(
    {
      _id: postId,
    },
    { deleteAt: validateKoreaDate(new Date()) },
  );
};

const createLoungePostCommentService = async (
  authorization,
  postId,
  comment,
) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify postId
  const post = await postModel.findOne({
    _id: postId,
  });

  if (!post) {
    throw Error('게시글 정보를 확인해 주세요.');
  }
  // create post Comment
  const postComment = new postCommentModel({
    postType: 'lounge',
    postId,
    userId: decode.id,
    comment,
    createAt: validateKoreaDate(new Date()),
    updateAt: null,
    deleteAt: null,
  });
  await postComment.save();
  // Response
  const resultData = {
    commentId: postComment._id,
  };
  return resultData;
};

const updateLoungePostCommentService = async (
  authorization,
  commentId,
  comment,
) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify comment
  const postComment = await postCommentModel.findOne({
    _id: commentId,
  });
  if (!postComment) {
    throw Error('코멘트 정보를 확인해 주세요.');
  }
  const author = await postCommentModel.findOne({
    _id: commentId,
    userId: decode.id,
  });
  if (!author) {
    throw Error('작성자를 확인해 주세요.');
  }
  // Toto. 삭제된 코멘트 수정 불가 조건 추가
  // update lounge comment
  await postCommentModel.updateOne(
    {
      _id: commentId,
      userId: decode.id,
    },
    { comment, updateAt: validateKoreaDate(new Date()) },
  );
};

const deleteLoungePostCommentService = async (authorization, commentId) => {
  // verify token
  const decode = jwt.verify(authorization, config.jwtSecretKey);
  const user = userModel.findOne({
    userId: decode.id,
  });
  if (!user) {
    throw Error('유저 정보를 확인해주세요.');
  }
  // verify comment
  const postComment = await postCommentModel.findOne({
    _id: commentId,
  });
  if (!postComment) {
    throw Error('코멘트 정보를 확인해 주세요.');
  }
  const author = await postCommentModel.findOne({
    _id: commentId,
    userId: decode.id,
  });
  if (!author) {
    throw Error('권한을 확인해 주세요.');
  }
  // Toto. 삭제된 코멘트 수정 불가 조건 추가
  // update lounge comment
  await postCommentModel.updateOne(
    {
      _id: commentId,
      userId: decode.id,
    },
    { deleteAt: validateKoreaDate(new Date()) },
  );
};

module.exports = {
  createLoungePostService,
  readLoungePostDetailService,
  readLoungePostListService,
  updateLoungePostService,
  updateLoungePostLikeService,
  deleteLoungePostService,
  createLoungePostCommentService,
  updateLoungePostCommentService,
  deleteLoungePostCommentService,
};
