import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTToken.js";
import { Request } from "../models/request.model.js";
import { Chat } from "../models/chat.model.js";

export const createRequest = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside createRequest Controller function ********");

  const { receiverID } = req.body;
  const senderID = req.user._id;

  console.log("Sender ID: ", senderID);
  console.log("Receiver ID: ", receiverID);

  const existingRequest = await Request.find({ sender: senderID, receiver: receiverID });

  if (existingRequest.length > 0) {
    throw new ApiError(400, "Request already exists");
  }

  const receiver = await Request.create({
    sender: senderID,
    receiver: receiverID,
  });

  if (!receiver) return next(new ApiError(500, "Request not created"));

  res.status(201).json(new ApiResponse(201, receiver, "Request created successfully"));
});

export const getRequests = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside getRequests Controller function ********");

  const receiverID = req.user._id;

  const requests = await Request.find({ receiver: receiverID, status: "Pending" }).populate("sender");

  if (!requests || requests.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No pending requests"));
  }

  // Return full request objects with populated sender data
  const requestsWithSenderDetails = requests.map((request) => ({
    _id: request._id,
    id: request._id,
    ...request.sender._doc,
    sender: request.sender._id,
    status: request.status,
  }));

  return res.status(200).json(new ApiResponse(200, requestsWithSenderDetails, "Requests fetched successfully"));
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside acceptRequest Controller function ********");

  const { requestId } = req.body;
  const receiverID = req.user._id;

  // Find the request where current user is the receiver
  const existingRequest = await Request.findById(requestId);

  if (!existingRequest) {
    throw new ApiError(400, "Request does not exist");
  }

  if (existingRequest.receiver.toString() !== receiverID.toString()) {
    throw new ApiError(400, "Unauthorized: You are not the receiver of this request");
  }

  const senderID = existingRequest.sender;

  const existingChat = await Chat.find({ users: { $all: [senderID, receiverID] } });

  if (existingChat.length > 0) {
    throw new ApiError(400, "Chat already exists");
  }

  const chat = await Chat.create({
    users: [senderID, receiverID],
  });

  if (!chat) return next(new ApiError(500, "Chat not created"));

  await Request.findByIdAndUpdate(requestId, { status: "Connected" });

  res.status(201).json(new ApiResponse(201, chat, "Request accepted successfully"));
});

export const rejectRequest = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside rejectRequest Controller function ********");

  const { requestId } = req.body;
  const receiverID = req.user._id;

  const existingRequest = await Request.findById(requestId);

  if (!existingRequest) {
    throw new ApiError(400, "Request does not exist");
  }

  if (existingRequest.receiver.toString() !== receiverID.toString()) {
    throw new ApiError(400, "Unauthorized: You are not the receiver of this request");
  }

  await Request.findByIdAndUpdate(requestId, { status: "Rejected" });

  res.status(200).json(new ApiResponse(200, null, "Request rejected successfully"));
});
