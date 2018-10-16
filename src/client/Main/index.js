import { connect } from 'react-redux';
import Main from './Main';

const mapStateToProps = (state) => ({
  user: state.user,
});

// const mapDispatchToProps = () => {};

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Main);