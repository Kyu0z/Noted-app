import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Note {
  id: string;
  content: string;
}

const HomeScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const addNote = () => {
    if (currentNote.trim() !== '') {
      setNotes([
        ...notes,
        { id: Math.random().toString(), content: currentNote },
      ]);
      setCurrentNote('');
      Keyboard.dismiss(); // Đóng bàn phím
    }
  };

  const editNote = (noteId: string) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      setCurrentNote(noteToEdit.content);
      setIsEditing(true);
      setEditingNoteId(noteId);
    }
  };

  const updateNote = () => {
    setNotes(
      notes.map((note) =>
        note.id === editingNoteId ? { ...note, content: currentNote } : note
      )
    );
    setCurrentNote('');
    setIsEditing(false);
    setEditingNoteId(null);
    Keyboard.dismiss(); // Đóng bàn phím
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const clearInput = () => {
    setCurrentNote('');
    Keyboard.dismiss(); // Đóng bàn phím
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a new todo...</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Enter note'
          value={currentNote}
          onChangeText={setCurrentNote}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={isEditing ? updateNote : addNote}
          >
            <Text style={styles.buttonText}>
              {isEditing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearInput}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      {notes.length > 0 && (
        <View style={styles.listNote}>
          <Text style={styles.subHeading}>List Note</Text>
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.noteRow,
                  index === notes.length - 1 && styles.lastNoteRow,
                ]}
              >
                <Text style={styles.noteIndex}>{index + 1}. </Text>
                <View style={styles.noteContainer}>
                  <Text style={styles.noteContent}>{item.content}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => editNote(item.id)}>
                      <Icon name='edit' size={20} style={styles.editButton} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteNote(item.id)}>
                      <Icon
                        name='trash'
                        size={20}
                        style={styles.deleteButton}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 70,
  },
  heading: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 26,
  },
  subHeading: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    padding: 20,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color: '#fff',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listNote: {
    flex: 1,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  flatListContent: {
    padding: 20,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  lastNoteRow: {
    marginBottom: 0,
  },
  noteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 2,
    paddingLeft: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteIndex: {
    color: '#fff',
    marginRight: 8,
    alignSelf: 'flex-end',
    fontSize: 28,
  },
  noteContent: {
    flex: 1,
    color: '#fff',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    color: '#007BFF',
  },
  deleteButton: {
    color: 'red',
  },
});

export default HomeScreen;
