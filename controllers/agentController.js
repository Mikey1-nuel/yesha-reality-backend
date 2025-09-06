import {
  getAllAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../database.js";

//@desc Get all agents
//@route GET /agents
export async function fetchAgents(req, res) {
  try {
    const agents = await getAllAgents();
    res.json(agents);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//@desc Get a agent
//@route GET /agents/:id
export const fetchAgent = async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log("Requested agent ID:", req.params.id);


  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid agent ID" });
  }

  const agent = await getAgent(id);

  if (!agent) {
    const error = new Error(`An agent with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  }

  res.status(200).json(agent);
};

export const createNewAgent = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      gender,
      state,
      experience,
      agency,
      bio,
      password,
    } = req.body;

    console.log("Full request body:", req.body); // ✅ Log entire payload
    console.log("Bio field:", req.body.bio);     // ✅ Log just the bio

    const filename = req.file.filename;

    const result = await createAgent(
      fullName,
      email,
      phoneNumber,
      gender,
      state,
      experience,
      agency,
      bio,
      filename,
      password
    );

    res.status(201).json(result);
    console.log("Received password:", req.body.password);
    console.log("Uploaded file name:", req.file.filename);
  } catch (err) {
    const error = new Error(`The ${err.message}`);
    error.status = 400;
    return next(error);
  }
};

//@desc Delete aan agent
//@route DELETE /agents/:id
export const deleteAnAgent = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const result = await deleteAgent(id);

    if (result.affectedRows === 0) {
      const error = new Error(`An agent with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    const error = new Error(`Failed to delete agent: ${err.message}`);
    error.status = 500;
    return next(error);
  }
};
