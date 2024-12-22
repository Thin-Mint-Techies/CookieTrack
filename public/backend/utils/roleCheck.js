const isLeaderOrManager = (auth) => {
    const { role } = auth.token;
    return role === 'leader' || role === 'manager';
  };
  
const getTroops = async (req, res) => {
    const { auth } = req;
  
    if (!auth || !auth.token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      if (auth.token.role === 'parent') {
        // Return troops assigned to the parent
        const troops = await Firestore.collection('troops')
          .where('id', 'in', auth.token.troopIds)
          .get();
        return res.json(troops.docs.map((doc) => doc.data()));
      } else if (isLeaderOrManager(auth)) {
        // Return all troops for leaders or managers
        const troops = await Firestore.collection('troops').get();
        return res.json(troops.docs.map((doc) => doc.data()));
      }
      res.status(403).json({ error: 'Access denied' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching troops', details: error.message });
    }
};
