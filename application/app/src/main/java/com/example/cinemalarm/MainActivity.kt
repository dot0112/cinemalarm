package com.example.cinemalarm

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.activity.ComponentActivity
import java.util.UUID

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_view)

        val l = findViewById<Button>(R.id.L)
        val r = findViewById<Button>(R.id.R)
        val textView = findViewById<TextView>(R.id.textView)

        l.setOnClickListener(object : View.OnClickListener {
            override fun onClick(p0: View?) {
                textView.setText(getUuid())
            }
        })

        r.setOnClickListener(object : View.OnClickListener {
            override fun onClick(p0: View?) {
                textView.setText("R Button Clicked")
            }
        })
    }

    fun getUuid(): String {
        val sharedPrefs = getSharedPreferences("KEY_PREF", MODE_PRIVATE)
        var uuid = sharedPrefs.getString("KEY_UUID", null)
        if (uuid == null) {
            uuid = UUID.randomUUID().toString()
            sharedPrefs.edit().putString("KEY_UUID", uuid).apply()
        }
        return uuid
    }
}
