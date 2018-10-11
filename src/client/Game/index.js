import { connect } from 'react-redux';
import Game from './Game';

const mapStateToProps = (state) => ({
  players: state.players,
  monsters: state.monsters,
  chat: state.chat,
  user: state.user,
});

const mapDispatchToProps = () => {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);