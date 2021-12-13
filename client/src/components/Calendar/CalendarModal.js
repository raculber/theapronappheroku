import Modal from "../UI/Modal";
import CalendarRecipeCard from "../Recipe/CalendarRecipeCard";
import "./CalendarModal.css";
const CalendarModal = (props) => {
  return (
    <Modal onClose={props.onClose}>
      <div className="modal">
        {props.recipes.map((recipe) => (
          <CalendarRecipeCard
            recipe={recipe}
            date={props.date}
            key={recipe.id}
          />
        ))}
      </div>
    </Modal>
  );
};

export default CalendarModal;
