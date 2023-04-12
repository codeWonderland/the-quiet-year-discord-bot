// player.js

class Player {
    constructor(name, is_mod = false) {
      this.name = name;
      this.contempt_tokens = 0;
      this.is_mod = is_mod;
    }
  
    add_contempt() {
      this.contempt_tokens += 1;
      return this.contempt_tokens;
    }
  
    use_contempt() {
      if (this.contempt_tokens > 0) {
        this.contempt_tokens -= 1;
        return true;
      }
      return false;
    }
  }
  
  export default Player;
  